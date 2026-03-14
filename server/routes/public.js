import express from "express";
import User from "../models/User.js";
import Casting from "../models/Casting.js";

const router = express.Router();

// Public: list approved models (no auth). Used for /models and /new-faces cards.
const MODEL_FIELDS =
  "_id fullName username profilePhoto portfolio categories country city height weight dressSize shoeSize gender dateOfBirth bio instagram role createdAt";

const MODEL_BASE = { status: "approved", profileComplete: true, role: "model" };

// Resolve ordered usernames to approved models (match username or fullName, case-insensitive). Returns array in same order.
async function resolveUsernamesToModels(usernames) {
  const result = [];
  for (const name of usernames) {
    const q = String(name).trim();
    if (!q) continue;
    const regex = new RegExp("^" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i");
    const user = await User.findOne({
      ...MODEL_BASE,
      $or: [{ username: regex }, { fullName: regex }],
    })
      .select(MODEL_FIELDS)
      .lean();
    if (user) result.push(user);
  }
  return result;
}

// New Faces: fixed usernames (order = display order)
const NEW_FACES_USERNAMES = ["OPHELIE", "LADLI", "EMMY DRH", "ROSEDELEANNE", "MEGHA", "MILES"];
router.get("/sections/new-faces", async (_req, res) => {
  try {
    const users = await resolveUsernamesToModels(NEW_FACES_USERNAMES);
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Trending: fixed usernames
const TRENDING_USERNAMES = ["RITISA", "MARY KETH", "LAKSHANA", "IVAN 09", "SAMANTA", "KIARA"];
router.get("/sections/trending", async (_req, res) => {
  try {
    const users = await resolveUsernamesToModels(TRENDING_USERNAMES);
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Category slug → usernames (real data: one model per category as specified)
const CATEGORY_USERNAMES = {
  bold: ["LEA"],
  bikini: ["GWEN SUN"],
  mature: ["GENEVIEVECHALAND"],
  glamour: ["MEGHA"],
  commercial: ["VICTORIA"],
  fitness: ["BYRJOHA"],
};
router.get("/categories/:slug/models", async (req, res) => {
  try {
    const slug = (req.params.slug || "").toLowerCase().trim();
    const usernames = CATEGORY_USERNAMES[slug];
    if (!usernames || !usernames.length) return res.json([]);
    const users = await resolveUsernamesToModels(usernames);
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/models", async (_req, res) => {
  try {
    const users = await User.find({
      status: "approved",
      profileComplete: true,
      role: "model",
    })
      .select(MODEL_FIELDS)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Public: single approved model profile by id (for /model/[id]).
router.get("/models/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      _id: id,
      status: "approved",
      profileComplete: true,
      role: "model",
    })
      .select(MODEL_FIELDS)
      .lean();
    if (!user) return res.status(404).json({ error: "Model not found" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Public: list approved castings for casting page cards.
router.get("/castings", async (_req, res) => {
  try {
    const castings = await Casting.find({ approvalStatus: "approved" })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(castings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
