import mongoose from "mongoose";
import Repository from "../models/Repository.js";

/**
 * Loads the repository identified by :repoId and verifies that the
 * authenticated user owns it. Every nested route (files, staging, commits,
 * status, restore, etc.) depends on this running first, so that a user can
 * never read or mutate another user's data just by guessing/copying an ID.
 * Attaches the repository document to req.repo for downstream controllers.
 */
export const loadOwnedRepo = async (req, res, next) => {
  try {
    const { repoId } = req.params;

    if (!mongoose.isValidObjectId(repoId)) {
      return res.status(404).json({ success: false, message: "Repository not found" });
    }

    const repo = await Repository.findById(repoId);

    // Return 404 rather than 403 for a repo owned by someone else, so we
    // never reveal to an unauthorized caller that the ID even exists.
    if (!repo || String(repo.owner) !== String(req.user._id)) {
      return res.status(404).json({ success: false, message: "Repository not found" });
    }

    req.repo = repo;
    next();
  } catch (err) {
    next(err);
  }
};
