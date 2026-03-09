import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

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
router.post("/signup", async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
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
    res.status(500).json({ error: e.message || "Signup failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const token = signToken(user);
    const u = await User.findById(user._id).select("-password");
    res.json({ user: u, token });
  } catch (e) {
    res.status(500).json({ error: e.message || "Login failed" });
  }
});

// POST /api/auth/admin/signup — create admin account (only for emails listed in ADMIN_EMAILS)
router.post("/admin/signup", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
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
    res.status(500).json({ error: e.message || "Admin signup failed" });
  }
});

// POST /api/auth/admin/login — same as login but returns 403 if not admin
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
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
    res.status(500).json({ error: e.message || "Login failed" });
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

// PATCH /api/auth/me — update current user (role, profileComplete, status, fullName, phone, company)
router.patch("/me", auth, async (req, res) => {
  try {
    const allowed = ["role", "profileComplete", "status", "fullName", "phone", "company"];
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
    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true }).select("-password");
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message || "Update failed" });
  }
});

export default router;
