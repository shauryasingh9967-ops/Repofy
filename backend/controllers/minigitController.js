import File from "../models/File.js";
import Staging from "../models/Staging.js";
import Commit from "../models/Commit.js";
import { generateCommitId } from "../utils/hash.js";
import { logActivity } from "../utils/logActivity.js";

const getLatestCommit = (repoId) => Commit.findOne({ repository: repoId }).sort({ timestamp: -1 });

// ---------------- STAGE ----------------
export const stageFile = async (req, res, next) => {
  try {
    if (!req.repo.initialized) {
      return res.status(400).json({ success: false, message: "Repository is not initialized. Initialize it first." });
    }

    const file = await File.findById(req.params.fileId);
    if (!file || String(file.repository) !== String(req.repo._id)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    await Staging.findOneAndUpdate(
      { repository: req.repo._id, fileId: file._id },
      { fileName: file.name, content: file.content, addedAt: Date.now() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: `Staged "${file.name}"` });
  } catch (err) {
    next(err);
  }
};

export const unstageFile = async (req, res, next) => {
  try {
    const removed = await Staging.findOneAndDelete({ repository: req.repo._id, fileId: req.params.fileId });
    if (!removed) {
      return res.status(404).json({ success: false, message: "File is not staged" });
    }
    res.status(200).json({ success: true, message: "File unstaged" });
  } catch (err) {
    next(err);
  }
};

export const getStagingArea = async (req, res, next) => {
  try {
    const staged = await Staging.find({ repository: req.repo._id });
    res.status(200).json({ success: true, data: staged });
  } catch (err) {
    next(err);
  }
};

// ---------------- COMMIT ----------------
export const commitChanges = async (req, res, next) => {
  try {
    if (!req.repo.initialized) {
      return res.status(400).json({ success: false, message: "Repository is not initialized" });
    }

    const { message } = req.body;
    const stagedFiles = await Staging.find({ repository: req.repo._id });

    if (stagedFiles.length === 0) {
      return res.status(400).json({ success: false, message: "No staged changes to commit" });
    }

    const timestamp = Date.now();
    const parentCommit = await getLatestCommit(req.repo._id);

    const commitId = generateCommitId({
      repoId: req.repo._id,
      message,
      timestamp,
      parentCommitId: parentCommit ? parentCommit.commitId : null,
      files: stagedFiles,
    });

    const commit = await Commit.create({
      repository: req.repo._id,
      commitId,
      message: message.trim(),
      parentCommitId: parentCommit ? parentCommit.commitId : null,
      author: req.user._id,
      files: stagedFiles.map((f) => ({ fileId: f.fileId, fileName: f.fileName, content: f.content })),
      timestamp,
    });

    await Staging.deleteMany({ repository: req.repo._id });

    await logActivity({
      userId: req.user._id,
      repoId: req.repo._id,
      type: "commit",
      message: `Committed "${commit.message}" (${commitId.slice(0, 7)})`,
    });

    res.status(201).json({ success: true, data: commit });
  } catch (err) {
    next(err);
  }
};

export const getCommitHistory = async (req, res, next) => {
  try {
    const commits = await Commit.find({ repository: req.repo._id }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, data: commits });
  } catch (err) {
    next(err);
  }
};

export const searchCommits = async (req, res, next) => {
  try {
    const q = req.query.q || "";
    const commits = await Commit.find({
      repository: req.repo._id,
      $or: [{ message: { $regex: q, $options: "i" } }, { commitId: { $regex: q, $options: "i" } }],
    }).sort({ timestamp: -1 });

    res.status(200).json({ success: true, data: commits });
  } catch (err) {
    next(err);
  }
};

// ---------------- STATUS ----------------
export const getRepoStatus = async (req, res, next) => {
  try {
    const files = await File.find({ repository: req.repo._id });
    const stagingList = await Staging.find({ repository: req.repo._id });
    const stagedMap = {};
    stagingList.forEach((s) => (stagedMap[String(s.fileId)] = s));

    const latestCommit = await getLatestCommit(req.repo._id);
    const committedMap = {};
    if (latestCommit) {
      latestCommit.files.forEach((f) => (committedMap[String(f.fileId)] = f));
    }

    const status = files.map((file) => {
      const staged = stagedMap[String(file._id)];
      const committed = committedMap[String(file._id)];

      let state = "untracked";
      if (staged && staged.content === file.content) {
        state = "staged";
      } else if (staged && staged.content !== file.content) {
        state = "modified-after-staging";
      } else if (committed && committed.content === file.content) {
        state = "committed";
      } else if (committed && committed.content !== file.content) {
        state = "modified";
      }

      return { fileId: file._id, fileName: file.name, state };
    });

    res.status(200).json({
      success: true,
      data: {
        initialized: req.repo.initialized,
        files: status,
        hasStagedChanges: stagingList.length > 0,
        latestCommitId: latestCommit ? latestCommit.commitId : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ---------------- RESTORE ----------------
export const restoreVersion = async (req, res, next) => {
  try {
    const commit = await Commit.findOne({ repository: req.repo._id, commitId: req.params.commitId });
    if (!commit) {
      return res.status(404).json({ success: false, message: "Commit not found" });
    }

    await Promise.all(
      commit.files.map((f) =>
        File.findByIdAndUpdate(f.fileId, { content: f.content, size: f.content.length })
      )
    );

    await logActivity({
      userId: req.user._id,
      repoId: req.repo._id,
      type: "restore",
      message: `Restored version ${commit.commitId.slice(0, 7)}`,
    });

    res.status(200).json({ success: true, message: `Restored to commit ${commit.commitId.slice(0, 7)}` });
  } catch (err) {
    next(err);
  }
};
