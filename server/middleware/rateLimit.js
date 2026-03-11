import rateLimit from "express-rate-limit";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_GENERAL = 200; // per window for general API
const MAX_AUTH = 10; // login/signup per IP per window
const MAX_CONTACT = 5;
const MAX_UPLOAD = 30;

export const generalLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_GENERAL,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_AUTH,
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const contactLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_CONTACT,
  message: { error: "Too many messages. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: MAX_UPLOAD,
  message: { error: "Too many uploads. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});
