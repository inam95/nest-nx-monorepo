import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["local", "development", "production", "test"]).default("local"),
  PORT: z.coerce.number<string>().default(3001),
  FRONTEND_URL: z.url(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number<string>().default(5432),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d")
});

export type TEnv = z.infer<typeof envSchema>;

export function validateEnv(env: Record<string, unknown>) {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    console.error("❌ Invalid env:");
    console.error(JSON.stringify(result.error.flatten().fieldErrors, null, 2));
    process.exit(1);
  }

  return result.data;
}
