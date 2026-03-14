import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import validateEnv from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { generalLimiter, contactLimiter, uploadLimiter } from "./middleware/rateLimit.js";

import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";
import publicRoutes from "./routes/public.js";
import castingRoutes from "./routes/casting.js";

validateEnv();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

const app = express();

// Required when behind a proxy (e.g. Render, Vercel). Enables correct client IP for rate limiting.
app.set("trust proxy", 1);

const corsOptions = {
  credentials: true,
  origin:
    CORS_ORIGIN === "true" || !CORS_ORIGIN
      ? true
      : CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean),
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

app.use(generalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadLimiter, uploadRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/castings", castingRoutes);

app.get("/api/health", async (_req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbOk = dbState === 1;
    if (!dbOk) {
      return res.status(503).json({
        ok: false,
        error: "Service unavailable",
        db: dbState === 0 ? "disconnected" : dbState === 2 ? "connecting" : "disconnecting",
      });
    }
    res.json({ ok: true, db: "connected" });
  } catch (e) {
    res.status(503).json({ ok: false, error: "Health check failed" });
  }
});

app.use(errorHandler);

try {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected");
} catch (err) {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
