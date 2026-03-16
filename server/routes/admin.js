import express from "express";
import crypto from "node:crypto";
import mongoose from "mongoose";
import { auth, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";
import Casting from "../models/Casting.js";
import Contact from "../models/Contact.js";
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

// Public: check if email is admin (no auth required)
router.get("/check-email", async (req, res) => {
  const email = (req.query.email || "").toString().toLowerCase();
  if (!email) return res.json({ isAdmin: false });
  const user = await User.findOne({ email }).select("isAdmin");
  res.json({ isAdmin: !!user?.isAdmin });
});

router.use(auth);
router.use(adminOnly);

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const [
      totalUsers,
      pendingApprovals,
      totalModels,
      totalProfessionals,
      totalCastings,
      pendingCastings,
      totalContacts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "pending" }),
      User.countDocuments({ role: "model" }),
      User.countDocuments({ role: "professional" }),
      Casting.countDocuments(),
      Casting.countDocuments({ approvalStatus: "pending" }),
      Contact.countDocuments(),
    ]);
    res.json({
      totalUsers,
      pendingApprovals,
      totalModels,
      totalProfessionals,
      totalMarketplaceOffers: 0,
      pendingMarketplaceOffers: 0,
      totalCastings,
      pendingCastings,
      totalConnectionRequests: 0,
      pendingConnectionRequests: 0,
      totalContacts,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/users — list users with filters
router.get("/users", async (req, res) => {
  try {
    const { status, role, profile, search } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (role && role !== "all") filter.role = role;
    if (profile === "complete") filter.profileComplete = true;
    if (profile === "incomplete") filter.profileComplete = false;
    if (search && search.trim()) {
      filter.$or = [
        { email: new RegExp(search.trim(), "i") },
        { fullName: new RegExp(search.trim(), "i") },
        { username: new RegExp(search.trim(), "i") },
      ];
    }
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 }).limit(5000).lean();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/users/:id — single user
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/admin/users/:id — update user (status, rejectionReason)
router.patch("/users/:id", async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const update = {};
    if (status) update.status = status;
    if (rejectionReason !== undefined) update.rejectionReason = rejectionReason || "";
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/users/:id/force-password-reset
router.post("/users/:id/force-password-reset", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("+passwordResetTokenHash +passwordResetTokenExpiresAt");
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isAdmin) {
      return res.status(400).json({ error: "Admin password reset must be handled manually" });
    }

    user.password = crypto.randomBytes(32).toString("hex");
    user.passwordResetRequired = true;
    user.passwordResetRequiredAt = new Date();
    user.passwordResetTokenHash = "";
    user.passwordResetTokenExpiresAt = null;
    await user.save();

    res.json({
      ok: true,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        passwordResetRequired: user.passwordResetRequired,
        passwordResetRequiredAt: user.passwordResetRequiredAt,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/contacts — all contact messages (bookings, applications, general)
router.get("/contacts", async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type === "booking") filter.message = { $regex: /^\[BOOKING REQUEST\]/i };
    else if (type === "application") filter.message = { $regex: /^\[CASTING APPLICATION\]/i };
    else if (type === "partner") filter.message = { $regex: /^\[Partner Application\]/i };
    const contacts = await Contact.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    res.json(contacts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/castings
router.get("/castings", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== "all") filter.approvalStatus = status;
    const castings = await Casting.find(filter).populate("creatorId", "email fullName profilePhoto").sort({ createdAt: -1 }).limit(100).lean();
    res.json(castings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/admin/castings/:id — approve or reject casting
router.patch("/castings/:id", async (req, res) => {
  try {
    const { approvalStatus, rejectionReason } = req.body;
    const update = {};
    if (approvalStatus) update.approvalStatus = approvalStatus;
    if (rejectionReason !== undefined) update.rejectionReason = rejectionReason || "";
    const casting = await Casting.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
    if (!casting) return res.status(404).json({ error: "Casting not found" });
    res.json(casting);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Resolve a single name to model ID (role: model, match username or fullName)
async function resolveName(name) {
  const q = String(name).trim();
  if (!q) return null;
  const regex = new RegExp("^" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i");
  const user = await User.findOne({ role: "model", $or: [{ username: regex }, { fullName: regex }] }).select("_id").lean();
  return user ? user._id.toString() : null;
}

// GET /api/admin/homepage-sections — config + current New Faces & Trending models + approved models for picker.
// When config has no saved IDs, uses same default resolution as public site so admin sees "current" homepage lineup.
router.get("/homepage-sections", async (req, res) => {
  try {
    let config = await HomepageConfig.findOne().lean();
    if (!config) {
      await HomepageConfig.create({});
      config = await HomepageConfig.findOne().lean();
    }
    let newFacesIds = (config?.newFacesIds || []).map((id) => id.toString());
    let trendingIds = (config?.trendingIds || []).map((id) => id.toString());

    let newFaces = [];
    let trending = [];
    const approvedModels = await User.find(MODEL_BASE).select(MODEL_FIELDS).sort({ fullName: 1, username: 1 }).limit(500).lean();

    if (newFacesIds.length > 0) {
      const newFacesUsers = await User.find({ _id: { $in: newFacesIds }, ...MODEL_BASE }).select(MODEL_FIELDS).lean();
      const byId = Object.fromEntries(newFacesUsers.map((u) => [u._id.toString(), u]));
      newFaces = newFacesIds.map((id) => byId[id]).filter(Boolean);
    } else {
      newFaces = await resolveNewFacesDefault();
      newFacesIds = newFaces.map((u) => u._id.toString());
    }

    if (trendingIds.length > 0) {
      const trendingUsers = await User.find({ _id: { $in: trendingIds }, ...MODEL_BASE }).select(MODEL_FIELDS).lean();
      const byId = Object.fromEntries(trendingUsers.map((u) => [u._id.toString(), u]));
      trending = trendingIds.map((id) => byId[id]).filter(Boolean);
    } else {
      trending = await resolveTrendingDefault();
      trendingIds = trending.map((u) => u._id.toString());
    }

    // Trending Castings: saved IDs or default (all approved, newest first)
    let trendingCastingIds = (config?.trendingCastingIds || []).map((id) => id.toString());
    let trendingCastings = [];
    const approvedCastings = await Casting.find({ approvalStatus: "approved" }).sort({ createdAt: -1 }).limit(100).lean();
    if (trendingCastingIds.length > 0) {
      const list = await Casting.find({ _id: { $in: trendingCastingIds }, approvalStatus: "approved" }).lean();
      const byId = Object.fromEntries(list.map((c) => [c._id.toString(), c]));
      trendingCastings = trendingCastingIds.map((id) => byId[id]).filter(Boolean);
    } else {
      trendingCastings = approvedCastings.slice(0, 50);
      trendingCastingIds = trendingCastings.map((c) => c._id.toString());
    }

    res.json({
      config: { newFacesIds, trendingIds, trendingCastingIds },
      newFaces,
      trending,
      approvedModels,
      trendingCastings,
      approvedCastings,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/admin/homepage-sections — update New Faces, Trending models, and Trending Castings IDs
router.put("/homepage-sections", async (req, res) => {
  try {
    const { newFacesIds = [], trendingIds = [], trendingCastingIds = [] } = req.body;
    const sanitize = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr
        .map((id) => (typeof id === "string" ? id.trim() : String(id)))
        .filter((id) => id && mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));
    };
    let config = await HomepageConfig.findOne();
    if (!config) config = new HomepageConfig({});
    config.newFacesIds = sanitize(newFacesIds);
    config.trendingIds = sanitize(trendingIds);
    config.trendingCastingIds = sanitize(trendingCastingIds);
    await config.save();
    res.json({
      config: {
        newFacesIds: config.newFacesIds.map((id) => id.toString()),
        trendingIds: config.trendingIds.map((id) => id.toString()),
        trendingCastingIds: config.trendingCastingIds.map((id) => id.toString()),
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/homepage-categories — main categories + per-category model lists + approved models
router.get("/homepage-categories", async (req, res) => {
  try {
    const config = await HomepageConfig.findOne().lean();
    const approvedModels = await User.find(MODEL_BASE).select(MODEL_FIELDS).sort({ fullName: 1, username: 1 }).limit(500).lean();
    const mainCategories = config?.categoryDefinitions?.length
      ? config.categoryDefinitions.filter((c) => c && c.slug && String(c.slug).trim())
      : [...DEFAULT_CATEGORY_DEFINITIONS];
    const slugs = mainCategories.map((c) => String(c.slug).toLowerCase().trim());
    const categorySlots = {};
    for (const slug of slugs) {
      const catMap = config?.categoryIds;
      const savedIds = catMap && catMap.get ? catMap.get(slug) : (catMap?.[slug] || null);
      const ids = savedIds?.length ? savedIds.map((id) => id.toString()) : [];
      if (ids.length > 0) {
        const users = await User.find({ _id: { $in: ids }, ...MODEL_BASE }).select(MODEL_FIELDS).lean();
        const byId = Object.fromEntries(users.map((u) => [u._id.toString(), u]));
        categorySlots[slug] = { ids, models: ids.map((id) => byId[id]).filter(Boolean) };
      } else if (CATEGORY_USERNAMES[slug]) {
        const defaultModels = await resolveCategoryDefault(slug);
        categorySlots[slug] = { ids: defaultModels.map((u) => u._id.toString()), models: defaultModels };
      } else {
        categorySlots[slug] = { ids: [], models: [] };
      }
    }
    res.json({ mainCategories, categorySlots, approvedModels });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/admin/homepage-categories/main — set main category cards (add/remove/reorder)
router.put("/homepage-categories/main", async (req, res) => {
  try {
    const { categories: raw = [] } = req.body;
    const slugify = (s) => String(s || "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "category";
    const list = raw
      .filter((c) => c && (c.slug || c.name))
      .map((c) => ({
        slug: slugify(c.slug || c.name),
        name: String(c.name || c.slug || "Category").trim() || "Category",
        description: String(c.description || "").trim(),
      }));
    const seen = new Set();
    const unique = list.filter((c) => {
      if (seen.has(c.slug)) return false;
      seen.add(c.slug);
      return true;
    });
    let config = await HomepageConfig.findOne();
    if (!config) config = new HomepageConfig({});
    config.categoryDefinitions = unique;
    await config.save();
    res.json({ ok: true, mainCategories: config.categoryDefinitions });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/admin/homepage-categories/:slug — update model IDs for a category
router.put("/homepage-categories/:slug", async (req, res) => {
  try {
    const slug = (req.params.slug || "").toLowerCase().trim();
    const { ids = [] } = req.body;
    const sanitized = ids
      .map((id) => (typeof id === "string" ? id.trim() : String(id)))
      .filter((id) => id && mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));
    let config = await HomepageConfig.findOne();
    if (!config) config = new HomepageConfig({});
    if (!config.categoryIds) config.categoryIds = {};
    config.categoryIds.set ? config.categoryIds.set(slug, sanitized) : (config.categoryIds[slug] = sanitized);
    config.markModified("categoryIds");
    await config.save();
    res.json({ ok: true, slug, ids: sanitized.map((id) => id.toString()) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/homepage-latest — latest models config + approved models
router.get("/homepage-latest", async (req, res) => {
  try {
    const config = await HomepageConfig.findOne().lean();
    const savedIds = (config?.latestIds || []).map((id) => id.toString());
    const latestCount = config?.latestCount || 16;
    const approvedModels = await User.find(MODEL_BASE).select(MODEL_FIELDS).sort({ fullName: 1, username: 1 }).limit(500).lean();
    let latestModels = [];
    if (savedIds.length > 0) {
      const users = await User.find({ _id: { $in: savedIds }, ...MODEL_BASE }).select(MODEL_FIELDS).lean();
      const byId = Object.fromEntries(users.map((u) => [u._id.toString(), u]));
      latestModels = savedIds.map((id) => byId[id]).filter(Boolean);
    } else {
      latestModels = await User.find(MODEL_BASE).select(MODEL_FIELDS).sort({ updatedAt: -1 }).limit(latestCount).lean();
    }
    res.json({ ids: savedIds, count: latestCount, latestModels, approvedModels });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/admin/homepage-latest — update latest models IDs and/or count
router.put("/homepage-latest", async (req, res) => {
  try {
    const { ids = [], count } = req.body;
    const sanitized = ids
      .map((id) => (typeof id === "string" ? id.trim() : String(id)))
      .filter((id) => id && mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));
    let config = await HomepageConfig.findOne();
    if (!config) config = new HomepageConfig({});
    config.latestIds = sanitized;
    if (typeof count === "number" && count > 0) config.latestCount = count;
    await config.save();
    res.json({ ok: true, ids: sanitized.map((id) => id.toString()), count: config.latestCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/seed-categories — assign categories to fixed model names (Bold→LEA, Bikini→GWEN SUN, etc.)
router.post("/seed-categories", async (req, res) => {
  try {
    const categoryAssignments = [
      { category: "Bold", names: ["LEA"] },
      { category: "Bikini", names: ["GWEN SUN"] },
      { category: "Mature", names: ["GENEVIEVECHALAND"] },
      { category: "Glamour", names: ["MEGHA"] },
      { category: "Commercial", names: ["VICTORIA"] },
      { category: "Fitness", names: ["BYRJOHA"] },
    ];
    const assigned = [];
    for (const { category, names } of categoryAssignments) {
      for (const name of names) {
        const id = await resolveName(name);
        if (id) {
          await User.findByIdAndUpdate(id, { $addToSet: { categories: category } });
          assigned.push(`${name} → ${category}`);
        }
      }
    }
    res.json({ message: "Categories assigned", categoryAssigned: assigned });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
