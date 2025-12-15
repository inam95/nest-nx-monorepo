import { z } from "zod";

// ──────────────────────────────────────────────
// Request Schema
// ──────────────────────────────────────────────

export const signUpRequestSchema = z
  .object({
    email: z.email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

// ──────────────────────────────────────────────
// Response Schema (just the data, not wrapped)
// ──────────────────────────────────────────────

export const signUpDataSchema = z.object({
  id: z.uuid()
});

// ──────────────────────────────────────────────
// Inferred Types
// ──────────────────────────────────────────────

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;
export type SignUpData = z.infer<typeof signUpDataSchema>;
