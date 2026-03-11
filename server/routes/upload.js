import express from "express";
import multer from "multer";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ error: "File too large. Max 10MB per file." });
    if (err.code === "LIMIT_FILE_COUNT") return res.status(400).json({ error: "Too many files. Max 10 at a time." });
    if (err.code === "LIMIT_UNEXPECTED_FILE") return res.status(400).json({ error: "Unexpected field. Use 'file' or 'files'." });
  }
  if (err && err.message) return res.status(400).json({ error: err.message });
  next(err);
});
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || "model-m";
const BUNNY_API_KEY = process.env.BUNNY_STORAGE_API_KEY || process.env.BUNNY_API_KEY;
const BUNNY_CDN_URL = (process.env.BUNNY_CDN_URL || "").replace(/\/$/, "");
const BUNNY_REGION = process.env.BUNNY_STORAGE_REGION || "storage";
const STORAGE_HOST = BUNNY_REGION === "storage" ? "storage.bunnycdn.com" : `${BUNNY_REGION}.storage.bunnycdn.com`;

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB per file

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ACCEPTED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, WebP and GIF images are allowed."), false);
    }
  },
});

async function uploadToBunny(buffer, contentType, path) {
  if (!BUNNY_API_KEY) {
    throw new Error("Storage is not configured. Please try again later or contact support.");
  }
  const url = `https://${STORAGE_HOST}/${BUNNY_STORAGE_ZONE}/${path}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      AccessKey: BUNNY_API_KEY,
      "Content-Type": contentType,
    },
    body: buffer,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Upload failed. Please try again.");
  }
  if (BUNNY_CDN_URL) {
    return `${BUNNY_CDN_URL}/${path}`;
  }
  return `https://${BUNNY_STORAGE_ZONE}.b-cdn.net/${path}`;
}

function safeFilename(original) {
  const ext = (original || "").split(".").pop()?.toLowerCase() || "jpg";
  const base = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  return `${base}.${ext}`;
}

// POST /api/upload — single file (field: file). Query: folder=profile|portfolio|id|selfie
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Use field name 'file'." });
    }
    const folder = (req.query.folder || "uploads").replace(/[^a-z0-9_-]/gi, "") || "uploads";
    const path = `${folder}/${req.user._id}/${safeFilename(req.file.originalname)}`;
    const url = await uploadToBunny(req.file.buffer, req.file.mimetype, path);
    res.json({ url });
  } catch (e) {
    res.status(500).json({ error: e.message || "Upload failed" });
  }
});

// POST /api/upload/multiple — multiple files (field: files). Query: folder=portfolio
router.post("/multiple", auth, upload.array("files", 10), async (req, res) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ error: "No files uploaded. Use field name 'files'." });
    }
    const folder = (req.query.folder || "uploads").replace(/[^a-z0-9_-]/gi, "") || "uploads";
    const urls = [];
    for (const file of files) {
      const path = `${folder}/${req.user._id}/${safeFilename(file.originalname)}`;
      const url = await uploadToBunny(file.buffer, file.mimetype, path);
      urls.push(url);
    }
    res.json({ urls });
  } catch (e) {
    res.status(500).json({ error: e.message || "Upload failed" });
  }
});

export default router;
