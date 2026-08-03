import Repository from "../models/Repository.js";
import Commit from "../models/Commit.js";
import Activity from "../models/Activity.js";

export const getStats = async (req, res, next) => {
  try {
    const repos = await Repository.find({ owner: req.user._id }).select("_id");
    const repoIds = repos.map((r) => r._id);

    const commitCount = repoIds.length ? await Commit.countDocuments({ repository: { $in: repoIds } }) : 0;

    res.status(200).json({
      success: true,
      data: { repoCount: repos.length, commitCount },
    });
  } catch (err) {
    next(err);
  }
};

export const getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activities = await Activity.find({ user: req.user._id }).sort({ timestamp: -1 }).limit(limit);
    res.status(200).json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
};
