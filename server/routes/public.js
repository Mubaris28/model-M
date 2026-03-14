import express from "express";
import User from "../models/User.js";
import Casting from "../models/Casting.js";

const router = express.Router();

// Public: list approved models (no auth). Used for /models and /new-faces cards.
const MODEL_FIELDS =
  "_id fullName username profilePhoto portfolio categories country city height weight dressSize shoeSize gender dateOfBirth bio instagram role createdAt";

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
