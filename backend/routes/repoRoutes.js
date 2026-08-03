import express from "express";
import { body } from "express-validator";
import {
  createRepo,
  getRepos,
  getRepoById,
  renameRepo,
  deleteRepo,
  initRepo,
} from "../controllers/repoController.js";
import { protect } from "../middleware/auth.js";
import { loadOwnedRepo } from "../middleware/loadRepo.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const nameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("Repository name is required")
  .isLength({ max: 60 })
  .withMessage("Repository name is too long")
  .matches(/^[a-zA-Z0-9-_. ]+$/)
  .withMessage("Repository name contains invalid characters");

router.use(protect);

router.post("/", [nameValidator], validate, createRepo);
router.get("/", getRepos);
router.get("/:repoId", loadOwnedRepo, getRepoById);
router.put("/:repoId/rename", loadOwnedRepo, [nameValidator], validate, renameRepo);
router.post("/:repoId/init", loadOwnedRepo, initRepo);
router.delete("/:repoId", loadOwnedRepo, deleteRepo);

export default router;
