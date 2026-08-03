import Repository from "../models/Repository.js";
import File from "../models/File.js";
import Staging from "../models/Staging.js";
import Commit from "../models/Commit.js";
import { logActivity } from "../utils/logActivity.js";

export const createRepo = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const repo = await Repository.create({ owner: req.user._id, name: name.trim(), description: description || "" });
    await logActivity({
      userId: req.user._id,
      repoId: repo._id,
      type: "repo_created",
      message: `Created repository "${repo.name}"`,
    });

    res.status(201).json({ success: true, data: repo });
  } catch (err) {
    next(err);
  }
};

export const getRepos = async (req, res, next) => {
  try {
    const keyword = req.query.q
      ? { $or: [{ name: { $regex: req.query.q, $options: "i" } }, { description: { $regex: req.query.q, $options: "i" } }] }
      : {};

    const repos = await Repository.find({ owner: req.user._id, ...keyword }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: repos });
  } catch (err) {
    next(err);
  }
};

// req.repo is already loaded + ownership-verified by the loadOwnedRepo middleware.
export const getRepoById = async (req, res) => {
  res.status(200).json({ success: true, data: req.repo });
};

export const renameRepo = async (req, res, next) => {
  try {
    const { name } = req.body;
    req.repo.name = name.trim();
    await req.repo.save();

    await logActivity({
      userId: req.user._id,
      repoId: req.repo._id,
      type: "repo_renamed",
      message: `Renamed repository to "${req.repo.name}"`,
    });

    res.status(200).json({ success: true, data: req.repo });
  } catch (err) {
    next(err);
  }
};

export const initRepo = async (req, res, next) => {
  try {
    if (req.repo.initialized) {
      return res.status(400).json({ success: false, message: "Repository is already initialized" });
    }
    req.repo.initialized = true;
    await req.repo.save();

    await logActivity({
      userId: req.user._id,
      repoId: req.repo._id,
      type: "repo_initialized",
      message: `Initialized repository "${req.repo.name}"`,
    });

    res.status(200).json({ success: true, data: req.repo });
  } catch (err) {
    next(err);
  }
};

export const deleteRepo = async (req, res, next) => {
  try {
    const repoId = req.repo._id;
    const repoName = req.repo.name;

    await Promise.all([
      File.deleteMany({ repository: repoId }),
      Staging.deleteMany({ repository: repoId }),
      Commit.deleteMany({ repository: repoId }),
      req.repo.deleteOne(),
    ]);

    await logActivity({
      userId: req.user._id,
      repoId: null,
      type: "repo_deleted",
      message: `Deleted repository "${repoName}"`,
    });

    res.status(200).json({ success: true, message: "Repository deleted" });
  } catch (err) {
    next(err);
  }
};
