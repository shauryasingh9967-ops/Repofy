import mongoose from "mongoose";
import { idTransform } from "../utils/idTransform.js";

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  repository: { type: mongoose.Schema.Types.ObjectId, ref: "Repository", default: null },
  type: {
    type: String,
    enum: [
      "repo_created",
      "repo_renamed",
      "repo_deleted",
      "repo_initialized",
      "file_created",
      "file_edited",
      "file_deleted",
      "commit",
      "restore",
    ],
    required: true,
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

activitySchema.index({ user: 1, timestamp: -1 });

idTransform(activitySchema);

export default mongoose.model("Activity", activitySchema);
