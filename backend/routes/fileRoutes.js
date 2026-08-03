import express from "express";
import { body } from "express-validator";
import {
  createFile,
  uploadFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
  downloadFile,
} from "../controllers/fileController.js";
import { protect } from "../middleware/auth.js";
import { loadOwnedRepo } from "../middleware/loadRepo.js";
import { validate } from "../middleware/validate.js";

const router = express.Router({ mergeParams: true });

const nameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("File name is required")
  .isLength({ max: 120 })
  .withMessage("File name is too long");

router.use(protect, loadOwnedRepo);

router.post("/", [nameValidator], validate, createFile);
router.post("/upload", [nameValidator], validate, uploadFile);
router.get("/", getFiles);
router.get("/:fileId", getFileById);
router.get("/:fileId/download", downloadFile);
router.put("/:fileId", updateFile);
router.delete("/:fileId", deleteFile);

export default router;
