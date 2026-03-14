import express from "express";
import mongoose from "mongoose";
import { auth, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";
import Casting from "../models/Casting.js";
import Contact from "../models/Contact.js";
import HomepageConfig from "../models/HomepageConfig.js";

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
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 }).limit(200).lean();
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

// GET /api/admin/homepage-config — New Faces, Trending & Latest model ID lists
router.get("/homepage-config", async (req, res) => {
  try {
    const doc = await HomepageConfig.findOne().lean();
    const newFacesIds = (doc?.newFacesIds || []).map((id) => id.toString());
    const trendingIds = (doc?.trendingIds || []).map((id) => id.toString());
    const latestIds   = (doc?.latestIds   || []).map((id) => id.toString());
    res.json({ newFacesIds, trendingIds, latestIds });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/admin/homepage-config — set New Faces, Trending & Latest model IDs
router.patch("/homepage-config", async (req, res) => {
  try {
    const { newFacesIds, trendingIds, latestIds } = req.body;
    const toObjectIds = (arr) =>
      (Array.isArray(arr) ? arr : [])
        .filter((id) => id && typeof id === "string")
        .map((id) => {
          try {
            return new mongoose.Types.ObjectId(id);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    const update = {
      newFacesIds: toObjectIds(newFacesIds),
      trendingIds: toObjectIds(trendingIds),
      latestIds:   toObjectIds(latestIds),
    };
    const doc = await HomepageConfig.findOneAndUpdate({}, update, { new: true, upsert: true }).lean();
    res.json({
      newFacesIds: (doc?.newFacesIds || []).map((id) => id.toString()),
      trendingIds: (doc?.trendingIds || []).map((id) => id.toString()),
      latestIds:   (doc?.latestIds   || []).map((id) => id.toString()),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
