import z from "zod";

export const userRoleSchema = z.enum(["BASIC", "ADMIN", "SUPER_ADMIN"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  role: userRoleSchema,
  isEmailVerified: z.boolean()
});

export type User = z.infer<typeof userSchema>;

export const userSummarySchema = z.object({
  id: z.uuid(),
  email: z.email(),
  role: userRoleSchema
});

export type UserSummary = z.infer<typeof userSummarySchema>;
