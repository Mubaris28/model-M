import express from "express";
import { auth, adminOnly } from "../middleware/auth.js";
import Application from "../models/Application.js";
import Casting from "../models/Casting.js";
import User from "../models/User.js";
import { sendModelAppliedNotification, sendModelSuggestedEmail, sendApplicationRejectedEmail } from "../lib/email.js";

const router = express.Router();
router.use(auth);

// POST /api/applications — model applies to a casting
router.post("/", async (req, res) => {
  try {
    if (req.user.role !== "model" && !req.user.isAdmin) {
      return res.status(403).json({ error: "Only models can apply to castings." });
    }
    const { castingId, message } = req.body;
    if (!castingId) return res.status(400).json({ error: "castingId is required." });

    const casting = await Casting.findById(castingId);
    if (!casting) return res.status(404).json({ error: "Casting not found." });
    if (casting.approvalStatus !== "approved") {
      return res.status(400).json({ error: "This casting is not open for applications." });
    }

    const existing = await Application.findOne({ castingId, modelId: req.user._id });
    if (existing) return res.status(409).json({ error: "You have already applied to this casting." });

    const application = await Application.create({
      castingId,
      modelId: req.user._id,
      message: (message || "").trim(),
    });
    sendModelAppliedNotification({
      modelName: req.user.fullName,
      modelEmail: req.user.email,
      castingTitle: casting.title,
    }).catch(() => {});
    res.status(201).json(application);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: "You have already applied to this casting." });
    res.status(500).json({ error: e.message });
  }
});

// GET /api/applications/mine — model sees own applications
router.get("/mine", async (req, res) => {
  try {
    const apps = await Application.find({ modelId: req.user._id })
      .populate("castingId", "title brand location date imageUrls price")
      .sort({ createdAt: -1 })
      .lean();
    res.json(apps);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/applications/suggested — professional sees models suggested by admin for their castings
router.get("/suggested", async (req, res) => {
  try {
    if (req.user.role !== "professional" && !req.user.isAdmin) {
      return res.status(403).json({ error: "Access denied." });
    }
    const castings = await Casting.find({ creatorId: req.user._id }).select("_id").lean();
    const castingIds = castings.map((c) => c._id);

    const apps = await Application.find({
      castingId: { $in: castingIds },
      status: "suggested",
      adminSuggested: true,
    })
      .populate("modelId", "fullName username email profilePhoto portfolio height weight dressSize shoeSize gender country city categories bio instagram phone")
      .populate("castingId", "title brand location date price")
      .sort({ suggestedAt: -1 })
      .lean();
    res.json(apps);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/applications/professional?source=applied|admin|all
router.get("/professional", async (req, res) => {
  try {
    if (req.user.role !== "professional" && !req.user.isAdmin) {
      return res.status(403).json({ error: "Access denied." });
    }

    const source = String(req.query.source || "all");
    if (!["applied", "admin", "all"].includes(source)) {
      return res.status(400).json({ error: "Invalid source filter." });
    }

    const castings = await Casting.find({ creatorId: req.user._id }).select("_id").lean();
    const castingIds = castings.map((c) => c._id);

    const filter = { castingId: { $in: castingIds } };
    if (source === "applied") filter.adminSuggested = { $ne: true };
    if (source === "admin") filter.adminSuggested = true;

    const apps = await Application.find(filter)
      .populate("modelId", "fullName username email profilePhoto portfolio height weight dressSize shoeSize gender country city categories bio instagram phone")
      .populate("castingId", "title brand location date price")
      .sort({ suggestedAt: -1, createdAt: -1 })
      .lean();

    res.json(apps);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/applications/admin/casting/:castingId — admin sees all applications for a casting
router.get("/admin/casting/:castingId", adminOnly, async (req, res) => {
  try {
    const apps = await Application.find({ castingId: req.params.castingId })
      .populate("modelId", "fullName username email profilePhoto portfolio height weight dressSize shoeSize gender country city categories bio instagram phone")
      .sort({ createdAt: -1 })
      .lean();
    res.json(apps);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/applications/:id/suggest — admin suggests model to professional
router.patch("/:id/suggest", adminOnly, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("castingId", "title creatorId")
      .populate("modelId", "fullName");
    if (!app) return res.status(404).json({ error: "Application not found." });

    app.status = "suggested";
    app.adminSuggested = true;
    app.suggestedAt = new Date();
    await app.save();

    // Notify the professional who owns the casting
    const creator = await User.findById(app.castingId?.creatorId).select("email fullName").lean();
    if (creator?.email) {
      sendModelSuggestedEmail({
        to: creator.email,
        professionalName: creator.fullName,
        modelName: app.modelId?.fullName || "A model",
        castingTitle: app.castingId?.title || "your casting",
      }).catch(() => {});
    }

    res.json(app);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/applications/admin/suggest — admin suggests one or more models to a professional's casting
router.post("/admin/suggest", adminOnly, async (req, res) => {
  try {
    const { castingId, modelIds } = req.body;
    if (!castingId) return res.status(400).json({ error: "castingId is required." });
    if (!Array.isArray(modelIds) || modelIds.length === 0) {
      return res.status(400).json({ error: "modelIds must be a non-empty array." });
    }

    const casting = await Casting.findById(castingId).select("_id title creatorId");
    if (!casting) return res.status(404).json({ error: "Casting not found." });

    const uniqueModelIds = [...new Set(modelIds.map((id) => String(id)).filter(Boolean))];
    const validModels = await User.find({
      _id: { $in: uniqueModelIds },
      role: "model",
      status: "approved",
    })
      .select("_id fullName")
      .lean();
    const validIdSet = new Set(validModels.map((m) => String(m._id)));
    const modelNameMap = Object.fromEntries(validModels.map((m) => [String(m._id), m.fullName]));

    const now = new Date();
    let created = 0;
    let updated = 0;

    for (const modelId of uniqueModelIds) {
      if (!validIdSet.has(modelId)) continue;
      const existing = await Application.findOne({ castingId, modelId });
      if (existing) {
        existing.status = "suggested";
        existing.adminSuggested = true;
        existing.suggestedAt = now;
        await existing.save();
        updated += 1;
        continue;
      }

      await Application.create({
        castingId,
        modelId,
        message: "",
        status: "suggested",
        adminSuggested: true,
        suggestedAt: now,
      });
      created += 1;
    }

    // Notify professional
    const total = created + updated;
    if (total > 0 && casting.creatorId) {
      const professional = await User.findById(casting.creatorId).select("email fullName").lean();
      if (professional?.email) {
        const suggestedNames = uniqueModelIds
          .filter((id) => validIdSet.has(id))
          .map((id) => modelNameMap[id])
          .filter(Boolean);
        const modelLabel = suggestedNames.length === 1
          ? suggestedNames[0]
          : `${suggestedNames.length} models`;
        sendModelSuggestedEmail({
          to: professional.email,
          professionalName: professional.fullName,
          modelName: modelLabel,
          castingTitle: casting.title,
        }).catch(() => {});
      }
    }

    res.status(201).json({
      message: "Admin suggestions saved.",
      created,
      updated,
      total,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/applications/:id/reject — admin rejects an application
router.patch("/:id/reject", adminOnly, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("modelId", "fullName email")
      .populate("castingId", "title");
    if (!app) return res.status(404).json({ error: "Application not found." });

    app.status = "rejected";
    await app.save();

    if (app.modelId?.email) {
      sendApplicationRejectedEmail({
        to: app.modelId.email,
        modelName: app.modelId.fullName,
        castingTitle: app.castingId?.title || "the casting",
      }).catch(() => {});
    }

    res.json(app);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
