import express from "express";
import Contact from "../models/Contact.js";
import { sendContactEmail } from "../lib/email.js";

const router = express.Router();

// POST /api/contact — save to DB and send email to CONTACT_TO_EMAIL (default: mubarismuhammed33@gmail.com)
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required" });
    }
    await Contact.create({ name, email, message });
    await sendContactEmail({ name, email, message });
    res.status(201).json({ message: "Message sent successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message || "Failed to send message" });
  }
});

export default router;
