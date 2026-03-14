import express from "express";
import { auth } from "../middleware/auth.js";
import Casting from "../models/Casting.js";

const router = express.Router();

router.use(auth);

// POST /api/castings — create a new casting (professional users only)
router.post("/", async (req, res) => {
  try {
    if (req.user.role !== "professional" && !req.user.isAdmin) {
      return res.status(403).json({ error: "Only professional accounts can post castings." });
    }
    const { title, description, castingType, location, date, slots, brand, imageUrl } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required." });
    }
    const casting = await Casting.create({
      title: title.trim(),
      description: (description || "").trim(),
      castingType: (castingType || "").trim(),
      location: (location || "").trim(),
      date: date ? new Date(date) : undefined,
      slots: slots ? Number(slots) : 0,
      brand: (brand || "").trim(),
      imageUrl: (imageUrl || "").trim(),
      creatorId: req.user._id,
      approvalStatus: "pending",
    });
    res.status(201).json(casting);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/castings/mine — list the current user's own castings
router.get("/mine", async (req, res) => {
  try {
    const castings = await Casting.find({ creatorId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json(castings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/castings/:id — update own casting (only while pending)
router.patch("/:id", async (req, res) => {
  try {
    const casting = await Casting.findById(req.params.id);
    if (!casting) return res.status(404).json({ error: "Casting not found." });
    if (casting.creatorId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: "You can only edit your own castings." });
    }
    const { title, description, castingType, location, date, slots, brand, imageUrl } = req.body;
    if (title !== undefined) casting.title = title.trim();
    if (description !== undefined) casting.description = description.trim();
    if (castingType !== undefined) casting.castingType = castingType.trim();
    if (location !== undefined) casting.location = location.trim();
    if (date !== undefined) casting.date = date ? new Date(date) : undefined;
    if (slots !== undefined) casting.slots = Number(slots);
    if (brand !== undefined) casting.brand = brand.trim();
    if (imageUrl !== undefined) casting.imageUrl = (imageUrl || "").trim();
    await casting.save();
    res.json(casting);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/castings/:id — delete own casting
router.delete("/:id", async (req, res) => {
  try {
    const casting = await Casting.findById(req.params.id);
    if (!casting) return res.status(404).json({ error: "Casting not found." });
    if (casting.creatorId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: "You can only delete your own castings." });
    }
    await casting.deleteOne();
    res.json({ message: "Casting deleted." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
