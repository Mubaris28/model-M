import express from "express";
import Contact from "../models/Contact.js";
import { sendContactEmail, sendContactConfirmationEmail } from "../lib/email.js";
import { contactValidation } from "../middleware/validate.js";

const router = express.Router();

// POST /api/contact — save to DB and send email to CONTACT_TO_EMAIL
router.post("/", contactValidation, async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    await Contact.create({ name, email, message });

    // Notify admin and send user confirmation in parallel.
    await Promise.allSettled([
      sendContactEmail({ name, email, message }),
      sendContactConfirmationEmail({ to: email, name }),
    ]);

    res.status(201).json({ message: "Message sent successfully" });
  } catch (e) {
    e.statusCode = e.statusCode || 500;
    next(e);
  }
});

export default router;
