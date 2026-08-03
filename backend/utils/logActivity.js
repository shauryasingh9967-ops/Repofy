import Activity from "../models/Activity.js";

export const logActivity = async ({ userId, repoId, type, message }) => {
  try {
    await Activity.create({ user: userId, repository: repoId || null, type, message });
  } catch (err) {
    // Activity logging must never break the primary operation it's attached to.
    console.error("Failed to log activity:", err.message);
  }
};
