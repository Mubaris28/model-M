import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(200, "Name too long"),
    email: z.string().min(1, "Email is required").email("Valid email is required"),
    phone: z.string().max(50).optional().or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password"),
    agreeTerms: z
      .union([z.boolean(), z.array(z.any()), z.string()])
      .transform((val) => (Array.isArray(val) ? val.length > 0 : val === true || val === "on")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.agreeTerms === true, {
    message: "You must agree to the terms",
    path: ["agreeTerms"],
  });

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(1, "Message is required").max(10000, "Message too long"),
});

export const REPORT_TYPES = [
  "Harassment or Inappropriate Behavior",
  "Safety Concern",
  "Fraud or Scam",
  "Technical Issue",
  "Inappropriate Content",
  "Other",
] as const;

export const reportSchema = z.object({
  name: z.string().min(1, "Full name is required").max(200, "Name too long"),
  email: z.string().email("Valid email is required"),
  reportType: z.string().min(1, "Please select a report type"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long"),
  message: z.string().min(1, "Detailed description is required").max(5000, "Message too long"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
