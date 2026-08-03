import mongoose from "mongoose";
import { idTransform } from "../utils/idTransform.js";

const repositorySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    initialized: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// A user cannot have two repositories with the same name.
repositorySchema.index({ owner: 1, name: 1 }, { unique: true });

idTransform(repositorySchema);

export default mongoose.model("Repository", repositorySchema);
