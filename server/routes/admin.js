import express from "express";
import crypto from "node:crypto";
import mongoose from "mongoose";
import { Resend } from "resend";
import { auth, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";
import Casting from "../models/Casting.js";
import Contact from "../models/Contact.js";
import HomepageConfig from "../models/HomepageConfig.js";
import EmailCampaign from "../models/EmailCampaign.js";
import {
  resolveNewFacesDefault,
  resolveTrendingDefault,
  resolveCategoryDefault,
  MODEL_FIELDS,
  MODEL_BASE,
  CATEGORY_USERNAMES,
} from "../lib/homepageSectionResolve.js";
import {
  sendUserApprovedEmail,
  sendUserRejectedEmail,
  sendCastingApprovedEmail,
  sendCastingRejectedEmail,
} from "../lib/email.js";

const router = express.Router();

const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "admin@modelmanagement.mu";
const RESEND_BATCH_SIZE = 100;

let _resend = null;
function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeEmailList(input) {
  if (!input) return [];
  const values = Array.isArray(input)
    ? input
    : String(input)
        .split(/[\n,;]+/)
        .map((x) => x.trim());
  const dedup = new Set();
  for (const v of values) {
    const e = String(v || "").trim().toLowerCase();
    if (!e || !e.includes("@")) continue;
    dedup.add(e);
  }
  return [...dedup];
}

function buildUserFilter(filters = {}) {
  const roleSet = new Set(["model", "professional"]);
  const statusSet = new Set(["approved", "rejected", "pending"]);
  const genderSet = new Set(["male", "female"]);

  const roles = (Array.isArray(filters.roles) ? filters.roles : [])
    .map((x) => String(x).toLowerCase().trim())
    .filter((x) => roleSet.has(x));

  const statuses = (Array.isArray(filters.statuses) ? filters.statuses : [])
    .map((x) => String(x).toLowerCase().trim())
    .filter((x) => statusSet.has(x));

  const genders = (Array.isArray(filters.genders) ? filters.genders : [])
    .map((x) => String(x).toLowerCase().trim())
    .filter((x) => genderSet.has(x));

  const query = {};
  if (roles.length > 0) query.role = { $in: roles };
  if (statuses.length > 0) query.status = { $in: statuses };
  if (filters.profileCompleteOnly === true) query.profileComplete = true;
  if (genders.length > 0) {
    query.gender = {
      $in: genders.map((g) => new RegExp(`^${escapeRegex(g)}$`, "i")),
    };
  }

  return {
    query,
    normalized: {
      roles,
      statuses,
      profileCompleteOnly: filters.profileCompleteOnly === true,
      genders,
    },
  };
}

async function sendSingleEmail(resend, { to, subject, message }) {
  try {
    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to,
      subject,
      text: message,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err?.message || "Send failed" };
  }
}

async function sendCampaignEmails(resend, recipients, subject, message) {
  const supportsBulkApi = !!(resend?.batch && typeof resend.batch.send === "function");
  let usedBulkApi = false;
  let successCount = 0;
  const failedRecipients = [];

  if (supportsBulkApi && recipients.length > 1) {
    usedBulkApi = true;
    for (let i = 0; i < recipients.length; i += RESEND_BATCH_SIZE) {
      const chunk = recipients.slice(i, i + RESEND_BATCH_SIZE);
      const payload = chunk.map((to) => ({
        from: RESEND_FROM_EMAIL,
        to,
        subject,
        text: message,
      }));

      try {
        await resend.batch.send(payload);
        successCount += chunk.length;
      } catch (batchError) {
        for (const to of chunk) {
          const single = await sendSingleEmail(resend, { to, subject, message });
          if (single.ok) successCount += 1;
          else failedRecipients.push({ email: to, error: single.error });
        }
        if (chunk.length > 0 && failedRecipients.length === 0) {
          failedRecipients.push({ email: chunk[0], error: batchError?.message || "Batch send failed" });
        }
      }
    }
  } else {
    for (const to of recipients) {
      const single = await sendSingleEmail(resend, { to, subject, message });
      if (single.ok) successCount += 1;
      else failedRecipients.push({ email: to, error: single.error });
    }
  }

  return {
    usedBulkApi,
    successCount,
    failedRecipients,
  };
}

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

    if (status === "approved") {
      sendUserApprovedEmail({ to: user.email, fullName: user.fullName }).catch(() => {});
    } else if (status === "rejected") {
      sendUserRejectedEmail({ to: user.email, fullName: user.fullName, reason: rejectionReason }).catch(() => {});
    }

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
    const casting = await Casting.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate("creatorId", "email fullName")
      .lean();
    if (!casting) return res.status(404).json({ error: "Casting not found" });

    const creator = casting.creatorId;
    if (creator?.email) {
      if (approvalStatus === "approved") {
        sendCastingApprovedEmail({ to: creator.email, fullName: creator.fullName, castingTitle: casting.title }).catch(() => {});
      } else if (approvalStatus === "rejected") {
        sendCastingRejectedEmail({ to: creator.email, fullName: creator.fullName, castingTitle: casting.title, reason: rejectionReason }).catch(() => {});
      }
    }

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

// GET /api/admin/homepage-categories — per-category model lists + approved models for picker
router.get("/homepage-categories", async (req, res) => {
  try {
    const config = await HomepageConfig.findOne().lean();
    const approvedModels = await User.find(MODEL_BASE).select(MODEL_FIELDS).sort({ fullName: 1, username: 1 }).limit(500).lean();
    const categorySlots = {};
    for (const slug of Object.keys(CATEGORY_USERNAMES)) {
      const catMap = config?.categoryIds;
      const savedIds = catMap && catMap.get ? catMap.get(slug) : (catMap?.[slug] || null);
      const ids = savedIds?.length ? savedIds.map((id) => id.toString()) : [];
      if (ids.length > 0) {
        const users = await User.find({ _id: { $in: ids }, ...MODEL_BASE }).select(MODEL_FIELDS).lean();
        const byId = Object.fromEntries(users.map((u) => [u._id.toString(), u]));
        categorySlots[slug] = { ids, models: ids.map((id) => byId[id]).filter(Boolean) };
      } else {
        const defaultModels = await resolveCategoryDefault(slug);
        categorySlots[slug] = { ids: defaultModels.map((u) => u._id.toString()), models: defaultModels };
      }
    }
    res.json({ categorySlots, approvedModels });
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

// GET /api/admin/email/capabilities — check provider setup and bulk support
router.get("/email/capabilities", async (_req, res) => {
  try {
    const resend = getResendClient();
    const supportsBulkApi = !!(resend?.batch && typeof resend.batch.send === "function");
    res.json({
      provider: "resend",
      configured: !!resend,
      fromEmail: RESEND_FROM_EMAIL,
      supportsBulkApi,
      maxBatchSize: RESEND_BATCH_SIZE,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/email/history — latest sent email campaigns
router.get("/email/history", async (req, res) => {
  try {
    const rawLimit = Number(req.query.limit || 30);
    const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(100, rawLimit)) : 30;
    const history = await EmailCampaign.find()
      .populate("createdBy", "email fullName")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json(history);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/email/send — send filtered and/or specific user emails
router.post("/email/send", async (req, res) => {
  try {
    const subject = String(req.body.subject || "").trim();
    const message = String(req.body.message || "").trim();
    const filters = req.body.filters || {};
    const useFilters = req.body.useFilters !== false;
    const useSpecific = req.body.useSpecific === true;
    const specificEmailsInput = normalizeEmailList(req.body.specificEmails);

    if (!subject) return res.status(400).json({ error: "Subject is required" });
    if (!message) return res.status(400).json({ error: "Message is required" });
    if (!useFilters && !useSpecific) {
      return res.status(400).json({ error: "Select at least one target mode (filters or specific users)" });
    }

    const resend = getResendClient();
    if (!resend) return res.status(400).json({ error: "Resend is not configured on server" });

    const { query: filterQuery, normalized } = buildUserFilter(filters);
    const recipientSet = new Set();

    if (useFilters) {
      const filteredUsers = await User.find(filterQuery).select("email").lean();
      for (const u of filteredUsers) {
        if (u.email) recipientSet.add(String(u.email).toLowerCase());
      }
    }

    let matchedSpecific = 0;
    if (useSpecific && specificEmailsInput.length > 0) {
      const existing = await User.find({ email: { $in: specificEmailsInput } }).select("email").lean();
      matchedSpecific = existing.length;
      for (const u of existing) {
        if (u.email) recipientSet.add(String(u.email).toLowerCase());
      }
    }

    const recipients = [...recipientSet];
    if (recipients.length === 0) {
      return res.status(400).json({ error: "No recipients found for selected filters/specific users" });
    }

    const result = await sendCampaignEmails(resend, recipients, subject, message);
    const failedCount = result.failedRecipients.length;
    const successCount = result.successCount;

    const history = await EmailCampaign.create({
      subject,
      message,
      filters: normalized,
      specificEmails: specificEmailsInput,
      useFilters,
      useSpecific,
      provider: "resend",
      usedBulkApi: result.usedBulkApi,
      recipientCount: recipients.length,
      successCount,
      failedCount,
      recipientSample: recipients.slice(0, 20),
      failedRecipients: result.failedRecipients.slice(0, 50),
      createdBy: req.user._id,
    });

    res.json({
      ok: true,
      id: history._id,
      recipientCount: recipients.length,
      successCount,
      failedCount,
      matchedSpecific,
      usedBulkApi: result.usedBulkApi,
      filters: normalized,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
