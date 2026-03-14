import express from "express";
import User from "../models/User.js";
import Casting from "../models/Casting.js";

const router = express.Router();

// Public: list approved models (no auth). Used for /models and /new-faces cards.
const MODEL_FIELDS =
  "_id fullName username profilePhoto portfolio categories country city height weight dressSize shoeSize gender dateOfBirth bio instagram role createdAt";

const MODEL_BASE = { status: "approved", profileComplete: true, role: "model" };

// Resolve ordered names to approved models — tries exact match first, then partial word match.
async function resolveUsernamesToModels(usernames) {
  const result = [];
  for (const name of usernames) {
    const q = String(name).trim();
    if (!q) continue;
    // 1. Exact match (case-insensitive) on username or fullName
    const exactRegex = new RegExp("^" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i");
    let user = await User.findOne({
      ...MODEL_BASE,
      $or: [{ username: exactRegex }, { fullName: exactRegex }],
    })
      .select(MODEL_FIELDS)
      .lean();
    // 2. If not found, try matching on each individual word (3+ chars)
    if (!user) {
      const words = q.split(/\s+/).filter((w) => w.length >= 3);
      for (const word of words) {
        const wordRegex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        user = await User.findOne({
          ...MODEL_BASE,
          $or: [{ username: wordRegex }, { fullName: wordRegex }],
        })
          .select(MODEL_FIELDS)
          .lean();
        if (user) break;
      }
    }
    if (user) result.push(user);
  }
  return result;
}

// New Faces: fixed names (order = display order)
const NEW_FACES_USERNAMES = [
  "Ophélie Philogène",
  "Moutoucomarapoule Ladli",
  "Emmy Kelianne Durhône",
  "HOAREAU Léanne",
  "Miles Williams",
  "Mary Grace Tracy John",
];
router.get("/sections/new-faces", async (_req, res) => {
  try {
    const users = await resolveUsernamesToModels(NEW_FACES_USERNAMES);
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Trending: fixed names
const TRENDING_USERNAMES = [
  "Ritisha Khedoo",
  "Gulbul Mary-keth Taylor Alicia Goder",
  "Kiara Delnard",
  "Samanta Luchoo",
  "Lea Ferhat-Huckel",
  "Victoria Ruth Claire Walys Philippe",
];
router.get("/sections/trending", async (_req, res) => {
  try {
    const users = await resolveUsernamesToModels(TRENDING_USERNAMES);
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Category slug → model names (display order for category sub-pages)
const CATEGORY_USERNAMES = {
  bold: ["Lea Ferhat-Huckel"],
  bikini: ["Gwendoline"],
  mature: ["Chaland Geneviève"],
  glamour: ["Megha Luchmun"],
  commercial: ["Victoria Ruth Claire Walys Philippe"],
  fitness: ["Johanna Boyer"],
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
