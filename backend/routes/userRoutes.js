import express from "express";
import { body } from "express-validator";
import { updateProfile, changePassword } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);

router.put(
  "/profile",
  [body("name").trim().notEmpty().withMessage("Name is required")],
  validate,
  updateProfile
);

router.put(
  "/change-password",
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  validate,
  changePassword
);

export default router;
