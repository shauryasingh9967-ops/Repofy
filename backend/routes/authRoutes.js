import express from "express";
import { body, param } from "express-validator";
import {
  register,
  login,
  logout,
  refresh,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", protect, getMe);

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("A valid email is required").normalizeEmail()],
  validate,
  forgotPassword
);

router.post(
  "/reset-password/:token",
  [
    param("token").notEmpty(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  resetPassword
);

export default router;
