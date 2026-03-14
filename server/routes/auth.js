import express from "express";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import {
  signupValidation,
  loginValidation,
  adminSignupValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from "../middleware/validate.js";
import { sendPasswordResetEmail } from "../lib/email.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function signToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email, isAdmin: !!user.isAdmin },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/signup
router.post("/signup", signupValidation, async (req, res, next) => {
  try {
    const { email, password, fullName, phone } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      fullName: fullName || "",
      phone: phone || "",
      role: "user",
      status: "pending",
      profileComplete: false,
      isAdmin,
    });
    const token = signToken(user);
    const u = await User.findById(user._id).select("-password");
    res.status(201).json({ user: u, token });
  } catch (e) {
    e.statusCode = e.statusCode || 500;
    next(e);
  }
});

// POST /api/auth/login
router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    if (user.passwordResetRequired) {
      return res.status(403).json({
        error: "Password reset required",
        code: "PASSWORD_RESET_REQUIRED",
      });
    }
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const token = signToken(user);
    const u = await User.findById(user._id).select("-password");
    res.json({ user: u, token });
  } catch (e) {
    e.statusCode = e.statusCode || 500;
    next(e);
  }
});

// POST /api/auth/forgot-password
// Always returns success-style response to avoid email enumeration.
router.post("/forgot-password", forgotPasswordValidation, async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordResetTokenHash");

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

      user.passwordResetTokenHash = tokenHash;
      user.passwordResetTokenExpiresAt = expiresAt;
      user.passwordResetRequired = true;
      user.passwordResetRequiredAt = user.passwordResetRequiredAt || new Date();
      await user.save();

      await sendPasswordResetEmail({
        to: user.email,
        fullName: user.fullName,
        token: rawToken,
      });
    }

    res.json({
      ok: true,
      message: "If this email exists, a password reset link has been sent.",
    });
  } catch (e) {
    e.statusCode = e.statusCode || 500;
    next(e);
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", resetPasswordValidation, async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetTokenExpiresAt: { $gt: new Date() },
    }).select("+password +passwordResetTokenHash +passwordResetTokenExpiresAt");

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    user.password = password;
    user.passwordResetRequired = false;
    user.passwordResetRequiredAt = null;
    user.passwordResetTokenHash = "";
    user.passwordResetTokenExpiresAt = null;
    await user.save();

    res.json({ ok: true, message: "Password updated successfully" });
  } catch (e) {
    e.statusCode = e.statusCode || 500;
    next(e);
  }
});

// POST /api/auth/admin/signup — create admin account (only for emails listed in ADMIN_EMAILS)
router.post("/admin/signup", adminSignupValidation, async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;
    const emailLower = email.toLowerCase();
    if (!ADMIN_EMAILS.includes(emailLower)) {
      return res.status(403).json({ error: "This email is not authorized to create an admin account." });
    }
    const existing = await User.findOne({ email: emailLower });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists. Use Login instead." });
    }
    const user = await User.create({
      email: emailLower,
      password,
      fullName: fullName || "",
      phone: "",
      role: "user",
      status: "approved",
      profileComplete: true,
      isAdmin: true,
    });
    const token = signToken(user);
    const u = await User.findById(user._id).select("-password");
    res.status(201).json({ user: u, token });
  } catch (e) {
    e.statusCode = e.statusCode || 500;
    next(e);
  }
});

// POST /api/auth/admin/login — same as login but returns 403 if not admin
router.post("/admin/login", loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });
    if (!user.isAdmin) {
      return res.status(403).json({ error: "Access denied. You do not have admin privileges." });
    }
    const token = signToken(user);
    const u = await User.findById(user._id).select("-password");
    res.json({ user: u, token });
  } catch (e) {
    e.statusCode = e.statusCode || 500;
    next(e);
  }
});

// GET /api/auth/me — current user (requires auth)
router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

// GET /api/auth/check-admin — returns { isAdmin } (requires auth)
router.get("/check-admin", auth, (req, res) => {
  res.json({ isAdmin: !!req.user.isAdmin });
});

// PATCH /api/auth/me — update current user (role, profileComplete, status, fullName, phone, company, profilePhoto, portfolio, idPhotoUrl, selfieWithIdUrl, bio, country)
router.patch("/me", auth, async (req, res, next) => {
  try {
    const allowed = ["role", "profileComplete", "status", "fullName", "username", "phone", "company", "profilePhoto", "portfolio", "idPhotoUrl", "selfieWithIdUrl", "bio", "country", "dateOfBirth", "gender", "city", "height", "weight", "dressSize", "shoeSize", "eyeColor", "hairColor", "categories", "instagram", "idNumber"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (updates.role && !["user", "model", "professional"].includes(updates.role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    if (updates.status) {
      if (!["pending", "approved", "rejected", "changes_requested", "updated"].includes(updates.status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const current = (req.user.status || "").toLowerCase();
      // User may only set status to 'pending' when reapplying after rejection
      if (current === "rejected" && updates.status === "pending") {
        updates.rejectionReason = "";
      } else if (current !== updates.status) {
        return res.status(403).json({ error: "Only admin can change your status" });
      }
    }
    if (updates.portfolio !== undefined) {
      if (!Array.isArray(updates.portfolio)) return res.status(400).json({ error: "Portfolio must be an array of URLs" });
      updates.portfolio = updates.portfolio.filter((u) => typeof u === "string" && u.length > 0).slice(0, 10);
    }
    if (updates.categories !== undefined) {
      if (!Array.isArray(updates.categories)) return res.status(400).json({ error: "Categories must be an array" });
      updates.categories = updates.categories.filter((c) => typeof c === "string").slice(0, 20);
    }
    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true }).select("-password");
    res.json({ user });
  } catch (e) {
    e.statusCode = e.statusCode || 500;
    next(e);
  }
});

export default router;
