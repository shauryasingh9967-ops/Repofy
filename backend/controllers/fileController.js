import File from "../models/File.js";
import Staging from "../models/Staging.js";
import { logActivity } from "../utils/logActivity.js";

// Loads a file by :fileId and verifies it actually belongs to req.repo
// (which was already ownership-verified by loadOwnedRepo).
const getOwnedFile = async (req, res) => {
  const file = await File.findById(req.params.fileId);
  if (!file || String(file.repository) !== String(req.repo._id)) {
    res.status(404).json({ success: false, message: "File not found" });
    return null;
  }
  return file;
};

export const createFile = async (req, res, next) => {
  try {
    const { name, content } = req.body;

    const existing = await File.findOne({ repository: req.repo._id, name: name.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: "A file with this name already exists" });
    }

    const file = await File.create({
      repository: req.repo._id,
      name: name.trim(),
      content: content || "",
      size: (content || "").length,
    });

    await logActivity({
      userId: req.user._id,
      repoId: req.repo._id,
      type: "file_created",
      message: `Created file "${file.name}"`,
    });

    res.status(201).json({ success: true, data: file });
  } catch (err) {
    next(err);
  }
};

// Uploads are handled as text-content submissions (read client-side via
// FileReader and posted as JSON) — this is an educational, text-based VCS
// and doesn't need binary/blob storage.
export const uploadFile = (req, res, next) => createFile(req, res, next);

export const getFiles = async (req, res, next) => {
  try {
    const files = await File.find({ repository: req.repo._id }).sort({ name: 1 });
    res.status(200).json({ success: true, data: files });
  } catch (err) {
    next(err);
  }
};

export const getFileById = async (req, res, next) => {
  try {
    const file = await getOwnedFile(req, res);
    if (!file) return;
    res.status(200).json({ success: true, data: file });
  } catch (err) {
    next(err);
  }
};

export const updateFile = async (req, res, next) => {
  try {
    const file = await getOwnedFile(req, res);
    if (!file) return;

    const { content } = req.body;
    file.content = content || "";
    file.size = file.content.length;
    await file.save();

    await logActivity({
      userId: req.user._id,
      repoId: req.repo._id,
      type: "file_edited",
      message: `Edited file "${file.name}"`,
    });

    res.status(200).json({ success: true, data: file });
  } catch (err) {
    next(err);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const file = await getOwnedFile(req, res);
    if (!file) return;

    await Promise.all([file.deleteOne(), Staging.deleteMany({ repository: req.repo._id, fileId: file._id })]);

    await logActivity({
      userId: req.user._id,
      repoId: req.repo._id,
      type: "file_deleted",
      message: `Deleted file "${file.name}"`,
    });

    res.status(200).json({ success: true, message: "File deleted" });
  } catch (err) {
    next(err);
  }
};

export const downloadFile = async (req, res, next) => {
  try {
    const file = await getOwnedFile(req, res);
    if (!file) return;

    res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(file.content);
  } catch (err) {
    next(err);
  }
};
