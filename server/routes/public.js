import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Casting from "../models/Casting.js";
import HomepageConfig from "../models/HomepageConfig.js";
import {
  resolveNewFacesDefault,
  resolveTrendingDefault,
  resolveCategoryDefault,
  MODEL_FIELDS,
  MODEL_BASE,
  CATEGORY_USERNAMES,
  DEFAULT_CATEGORY_DEFINITIONS,
} from "../lib/homepageSectionResolve.js";

const router = express.Router();

function toPublicModel(user) {
  if (!user) return user;
  const { fullName, ...safeUser } = user;
  return safeUser;
}

router.get("/sections/new-faces", async (_req, res) => {
  try {
    const config = await HomepageConfig.findOne().lean();
    const ids = config?.newFacesIds?.length ? config.newFacesIds.map((id) => id.toString()) : [];
    if (ids.length > 0) {
      const users = await User.find({ _id: { $in: ids }, ...MODEL_BASE }).select(MODEL_FIELDS).lean();
      const byId = Object.fromEntries(users.map((u) => [u._id.toString(), u]));
      const ordered = ids.map((id) => byId[id]).filter(Boolean);
      ordered.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
      return res.json(ordered.map(toPublicModel));
    }
    const users = await resolveNewFacesDefault();
    users.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    res.json(users.map(toPublicModel));
  } catch (e) {
    if (mongoose.connection.readyState !== 1) return res.json([]);
    res.status(500).json({ error: e.message });
  }
});

router.get("/sections/trending", async (_req, res) => {
  try {
    const config = await HomepageConfig.findOne().lean();
    const ids = config?.trendingIds?.length ? config.trendingIds.map((id) => id.toString()) : [];
    if (ids.length > 0) {
      const users = await User.find({ _id: { $in: ids }, ...MODEL_BASE }).select(MODEL_FIELDS).lean();
      const byId = Object.fromEntries(users.map((u) => [u._id.toString(), u]));
      return res.json(ids.map((id) => byId[id]).filter(Boolean).map(toPublicModel));
    }
    const users = await resolveTrendingDefault();
    res.json(users.map(toPublicModel));
  } catch (e) {
    if (mongoose.connection.readyState !== 1) return res.json([]);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/public/sections/latest — latest models (uses latestIds override or newest by createdAt)
router.get("/sections/latest", async (_req, res) => {
  try {
    const config = await HomepageConfig.findOne().lean();
    const ids = config?.latestIds?.length ? config.latestIds.map((id) => id.toString()) : [];
    if (ids.length > 0) {
      const users = await User.find({ _id: { $in: ids }, ...MODEL_BASE }).select(MODEL_FIELDS).lean();
      const byId = Object.fromEntries(users.map((u) => [u._id.toString(), u]));
      return res.json(ids.map((id) => byId[id]).filter(Boolean).map(toPublicModel));
    }
    const count = config?.latestCount > 0 ? config.latestCount : 16;
    const users = await User.find({ ...MODEL_BASE }).select(MODEL_FIELDS).sort({ updatedAt: -1 }).limit(count).lean();
    res.json(users.map(toPublicModel));
  } catch (e) {
    if (mongoose.connection.readyState !== 1) return res.json([]);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/public/categories — list of main category cards (slug, name, description)
router.get("/categories", async (req, res) => {
  try {
    const config = await HomepageConfig.findOne().lean();
    const list = config?.categoryDefinitions?.length
      ? config.categoryDefinitions.filter((c) => c && c.slug && String(c.slug).trim())
      : DEFAULT_CATEGORY_DEFINITIONS;
    res.json({ categories: list });
  } catch (e) {
    if (mongoose.connection.readyState !== 1) return res.json({ categories: DEFAULT_CATEGORY_DEFINITIONS });
    res.status(500).json({ categories: [] });
  }
});

// GET /api/public/categories/:slug/models
router.get("/categories/:slug/models", async (req, res) => {
  try {
    const slug = (req.params.slug || "").toLowerCase().trim();
    const config = await HomepageConfig.findOne().lean();
    const catMap = config?.categoryIds;
    const savedIds = catMap && catMap.get ? catMap.get(slug) : (catMap?.[slug] || null);
    const ids = savedIds?.length ? savedIds.map((id) => id.toString()) : [];
    if (ids.length > 0) {
      const users = await User.find({ _id: { $in: ids }, ...MODEL_BASE }).select(MODEL_FIELDS).lean();
      const byId = Object.fromEntries(users.map((u) => [u._id.toString(), u]));
      return res.json(ids.map((id) => byId[id]).filter(Boolean).map(toPublicModel));
    }
    const users = await resolveCategoryDefault(slug);
    res.json(users.map(toPublicModel));
  } catch (e) {
    if (mongoose.connection.readyState !== 1) return res.json([]);
    res.status(500).json({ error: e.message });
  }
});

router.get("/models-count", async (_req, res) => {
  try {
    const count = await User.countDocuments({ status: "approved", profileComplete: true, role: "model" });
    res.json({ count });
  } catch (e) {
    if (mongoose.connection.readyState !== 1) return res.json({ count: 0 });
    res.status(500).json({ error: e.message });
  }
});

router.get("/models", async (_req, res) => {
  try {
    const users = await User.find({ status: "approved", profileComplete: true, role: "model" })
      .select(MODEL_FIELDS)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json(users.map(toPublicModel));
  } catch (e) {
    if (mongoose.connection.readyState !== 1) return res.json([]);
    res.status(500).json({ error: e.message });
  }
});

router.get("/models/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, status: "approved", profileComplete: true, role: "model" })
      .select(MODEL_FIELDS)
      .lean();
    if (!user) return res.status(404).json({ error: "Model not found" });
    res.json(toPublicModel(user));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/public/sections/trending-castings — for homepage Trending Castings section (ordered by config or default)
router.get("/sections/trending-castings", async (_req, res) => {
  try {
    const config = await HomepageConfig.findOne().lean();
    const ids = config?.trendingCastingIds?.length ? config.trendingCastingIds.map((id) => id.toString()) : [];
    if (ids.length > 0) {
      const castings = await Casting.find({ _id: { $in: ids }, approvalStatus: "approved" }).lean();
      const byId = Object.fromEntries(castings.map((c) => [c._id.toString(), c]));
      return res.json(ids.map((id) => byId[id]).filter(Boolean));
    }
    const castings = await Casting.find({ approvalStatus: "approved" }).sort({ createdAt: -1 }).limit(50).lean();
    res.json(castings);
  } catch (e) {
    if (mongoose.connection.readyState !== 1) return res.json([]);
    res.status(500).json({ error: e.message });
  }
});

router.get("/castings", async (_req, res) => {
  try {
    const castings = await Casting.find({ approvalStatus: "approved" }).sort({ createdAt: -1 }).limit(50).lean();
    res.json(castings);
  } catch (e) {
    if (mongoose.connection.readyState !== 1) return res.json([]);
    res.status(500).json({ error: e.message });
  }
});

export default router;
