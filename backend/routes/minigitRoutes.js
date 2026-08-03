import express from "express";
import { body } from "express-validator";
import {
  stageFile,
  unstageFile,
  getStagingArea,
  commitChanges,
  getCommitHistory,
  searchCommits,
  getRepoStatus,
  restoreVersion,
} from "../controllers/minigitController.js";
import { protect } from "../middleware/auth.js";
import { loadOwnedRepo } from "../middleware/loadRepo.js";
import { validate } from "../middleware/validate.js";

const router = express.Router({ mergeParams: true });

router.use(protect, loadOwnedRepo);

router.get("/status", getRepoStatus);
router.get("/staging", getStagingArea);
router.post("/staging/:fileId", stageFile);
router.delete("/staging/:fileId", unstageFile);

router.post(
  "/commit",
  [body("message").trim().notEmpty().withMessage("Commit message is required").isLength({ max: 300 })],
  validate,
  commitChanges
);

router.get("/commits", getCommitHistory);
router.get("/commits/search", searchCommits);
router.post("/restore/:commitId", restoreVersion);

export default router;
