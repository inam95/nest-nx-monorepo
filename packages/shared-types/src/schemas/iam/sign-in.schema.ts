import { z } from "zod";

import { userSchema } from "./user.schema";

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

export const signInDataSchema = userSchema;

// ──────────────────────────────────────────────
// Inferred Types
// ──────────────────────────────────────────────

export type SignInRequest = z.infer<typeof signInRequestSchema>;
export type SignInData = z.infer<typeof signInDataSchema>;
