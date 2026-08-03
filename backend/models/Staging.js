import mongoose from "mongoose";
import { idTransform } from "../utils/idTransform.js";

const stagingSchema = new mongoose.Schema(
  {
    repository: { type: mongoose.Schema.Types.ObjectId, ref: "Repository", required: true, index: true },
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    fileName: { type: String, required: true },
    content: { type: String, required: true, default: "" },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// A given file can only have one staged snapshot per repository at a time.
stagingSchema.index({ repository: 1, fileId: 1 }, { unique: true });

idTransform(stagingSchema);

export default mongoose.model("Staging", stagingSchema);
