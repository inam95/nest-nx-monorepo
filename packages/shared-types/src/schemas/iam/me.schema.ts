import type z from "zod";

import { userSchema } from "./user.schema";

export const meDataSchema = userSchema;
export type MeData = z.infer<typeof meDataSchema>;
