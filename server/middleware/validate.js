import { body, validationResult } from "express-validator";

function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const first = result.array({ onlyFirstError: true })[0];
  const message = first?.msg || "Validation failed";
  return res.status(400).json({ error: message });
}

export const signupValidation = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("fullName").optional().trim().isLength({ max: 200 }).withMessage("Name too long"),
  body("phone").optional().trim().isLength({ max: 50 }).withMessage("Phone too long"),
  handleValidation,
];

export const loginValidation = [
  body("email").trim().notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

export const forgotPasswordValidation = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  handleValidation,
];

export const resetPasswordValidation = [
  body("token").trim().notEmpty().withMessage("Reset token is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  handleValidation,
];

export const adminSignupValidation = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("fullName").optional().trim().isLength({ max: 200 }).withMessage("Name too long"),
  handleValidation,
];

export const contactValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 200 }).withMessage("Name too long"),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("message").trim().notEmpty().withMessage("Message is required").isLength({ max: 10000 }).withMessage("Message too long"),
  handleValidation,
];
