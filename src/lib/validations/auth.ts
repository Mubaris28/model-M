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
    agreeTerms: z.boolean(),
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

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
