import mongoose from "mongoose";
import { idTransform } from "../utils/idTransform.js";

const commitFileSchema = new mongoose.Schema(
  {
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    fileName: { type: String, required: true },
    content: { type: String, required: true, default: "" },
  },
  { _id: false }
);

const commitSchema = new mongoose.Schema(
  {
    repository: { type: mongoose.Schema.Types.ObjectId, ref: "Repository", required: true, index: true },
    commitId: { type: String, required: true, unique: true }, // SHA-256 hash
    message: { type: String, required: true, trim: true },
    parentCommitId: { type: String, default: null },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    files: { type: [commitFileSchema], default: [] },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

commitSchema.index({ repository: 1, timestamp: -1 });

idTransform(commitSchema);

export default mongoose.model("Commit", commitSchema);
