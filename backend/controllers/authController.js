import crypto from "crypto";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  refreshCookieOptions,
} from "../utils/tokens.js";
import { hashToken } from "../utils/hash.js";

const sendAuthResponse = (res, statusCode, user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  res.status(statusCode).json({
    success: true,
    data: {
      user: { id: user._id, name: user.name, email: user.email },
      accessToken,
    },
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });
    sendAuthResponse(res, 201, user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    sendAuthResponse(res, 200, user);
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.status(200).json({ success: true, message: "Logged out" });
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    const accessToken = generateAccessToken(user._id);
    res.status(200).json({ success: true, data: { accessToken } });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Refresh token invalid or expired" });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond with the same generic message, whether or not the
    // email exists, so this endpoint can't be used to enumerate accounts.
    const genericResponse = {
      success: true,
      message: "If an account with that email exists, a password reset link has been generated.",
    };

    if (!user) return res.status(200).json(genericResponse);

    const rawToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // No email service is wired up in this project, so the reset link is
    // returned directly in the response for local development/testing.
    // In production this would be emailed instead of returned here.
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${rawToken}`;

    res.status(200).json({ ...genericResponse, devResetUrl: resetUrl });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = hashToken(token);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({ success: false, message: "Reset link is invalid or has expired" });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    sendAuthResponse(res, 200, user);
  } catch (err) {
    next(err);
  }
};
