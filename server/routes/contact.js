import express from "express";
import Contact from "../models/Contact.js";
import { sendContactEmail } from "../lib/email.js";
import { contactValidation } from "../middleware/validate.js";

const router = express.Router();

// POST /api/contact — save to DB and send email to CONTACT_TO_EMAIL
router.post("/", contactValidation, async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    await Contact.create({ name, email, message });
    await sendContactEmail({ name, email, message });
    res.status(201).json({ message: "Message sent successfully" });
  } catch (e) {
    e.statusCode = e.statusCode || 500;
    next(e);
  }
});

export default router;
