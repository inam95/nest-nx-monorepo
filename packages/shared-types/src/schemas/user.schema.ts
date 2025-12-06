import { z } from "zod";

// Schema definitions
export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
