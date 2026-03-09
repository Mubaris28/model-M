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

export default router;
