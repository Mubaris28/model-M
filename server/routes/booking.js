import express from "express";
import { auth } from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import Application from "../models/Application.js";
import { sendBookingNotificationToModel, sendBookingNotificationToAdmin } from "../lib/email.js";

const router = express.Router();
router.use(auth);

// POST /api/bookings — professional books a model from a confirmed-available application
router.post("/", async (req, res) => {
  try {
    if (req.user.role !== "professional" && !req.user.isAdmin) {
      return res.status(403).json({ error: "Only professionals can book models." });
    }
    const { applicationId, notes } = req.body;
    if (!applicationId) return res.status(400).json({ error: "applicationId is required." });

    const app = await Application.findById(applicationId).populate("castingId", "creatorId title brand location date price");
    if (!app) return res.status(404).json({ error: "Application not found." });
    if (app.status === "booked" || app.status === "rejected") {
      return res.status(400).json({ error: "This application is not available for booking." });
    }
    if (app.castingId.creatorId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: "You can only book models for your own castings." });
    }

    app.status = "booked";
    await app.save();

    const booking = await Booking.create({
      castingId: app.castingId._id,
      modelId: app.modelId,
      professionalId: req.user._id,
      applicationId: app._id,
      notes: (notes || "").trim(),
    });

    const populated = await Booking.findById(booking._id)
      .populate("castingId", "title brand location date price imageUrls")
      .populate("modelId", "fullName username email profilePhoto")
      .populate("professionalId", "fullName company email")
      .lean();

    // Notify model and admin
    const model = populated.modelId;
    const professional = populated.professionalId;
    const castingTitle = populated.castingId?.title || "a casting";
    if (model?.email) {
      sendBookingNotificationToModel({
        to: model.email,
        modelName: model.fullName,
        castingTitle,
        professionalName: professional?.fullName || professional?.company,
        notes,
      }).catch(() => {});
    }
    sendBookingNotificationToAdmin({
      modelName: model?.fullName,
      modelEmail: model?.email,
      professionalName: professional?.fullName || professional?.company,
      professionalEmail: professional?.email,
      castingTitle,
    }).catch(() => {});

    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/bookings/mine — model or professional sees their own bookings
router.get("/mine", async (req, res) => {
  try {
    const filter =
      req.user.role === "model"
        ? { modelId: req.user._id }
        : req.user.role === "professional"
        ? { professionalId: req.user._id }
        : {};

    const bookings = await Booking.find(filter)
      .populate("castingId", "title brand location date price imageUrls")
      .populate("modelId", "fullName username email profilePhoto")
      .populate("professionalId", "fullName company email")
      .sort({ createdAt: -1 })
      .lean();
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
