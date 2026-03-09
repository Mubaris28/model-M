import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required" });
    }
    await Contact.create({ name, email, message });
    res.status(201).json({ message: "Message sent successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message || "Failed to send message" });
  }
});

export default router;
