import mongoose from "mongoose";
import { idTransform } from "../utils/idTransform.js";

const fileSchema = new mongoose.Schema(
  {
    repository: { type: mongoose.Schema.Types.ObjectId, ref: "Repository", required: true, index: true },
    name: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    size: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// A repository cannot have two files with the same name.
fileSchema.index({ repository: 1, name: 1 }, { unique: true });

idTransform(fileSchema);

export default mongoose.model("File", fileSchema);
