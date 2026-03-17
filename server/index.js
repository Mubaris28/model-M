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
import applicationRoutes from "./routes/application.js";
import bookingRoutes from "./routes/booking.js";

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
app.use("/api/applications", applicationRoutes);
app.use("/api/bookings", bookingRoutes);

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

// Bind to 0.0.0.0 so the server is reachable on all interfaces:
// - locally: accessible on 127.0.0.1 and any local IP
// - on Render/Railway/Fly: required so the platform can route public traffic in
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

// Connect to MongoDB in the background (do not exit if it fails — server stays up for health checks)
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,   // give up selecting a server after 10s (not 30s default)
  connectTimeoutMS: 10000,           // TCP connection timeout
  socketTimeoutMS: 30000,            // individual operation timeout
  maxPoolSize: 10,                   // keep up to 10 connections in pool (reuse instead of re-open)
  minPoolSize: 2,                    // keep at least 2 warm connections alive
  heartbeatFrequencyMS: 10000,       // ping Atlas every 10s to keep connections alive
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err.message);
  console.error("→ If using Atlas: add your IP to the cluster IP whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/");
});
