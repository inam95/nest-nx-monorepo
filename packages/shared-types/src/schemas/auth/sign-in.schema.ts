import { z } from "zod";

// ──────────────────────────────────────────────
// Request Schema
// ──────────────────────────────────────────────

export const signInRequestSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

// ──────────────────────────────────────────────
// Response Schema (just the data, not wrapped)
// ──────────────────────────────────────────────

export const signInDataSchema = z.object({
  user: z.object({
    id: z.uuid(),
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(["L1_BASIC", "L2_ADMIN", "L3_SUPER_ADMIN"])
  })
});

// ──────────────────────────────────────────────
// Inferred Types
// ──────────────────────────────────────────────

export type SignInRequest = z.infer<typeof signInRequestSchema>;
export type SignInData = z.infer<typeof signInDataSchema>;
