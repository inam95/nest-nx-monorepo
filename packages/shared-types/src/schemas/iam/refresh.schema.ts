import type z from "zod";

import { userSchema } from "./user.schema";

export const refreshDataSchema = userSchema;
export type RefreshData = z.infer<typeof refreshDataSchema>;
