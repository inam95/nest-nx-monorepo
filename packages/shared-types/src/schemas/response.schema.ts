import { z } from "zod";

import { cursorPaginationMetaSchema, offsetPaginationMetaSchema } from "./pagination.schema";

export function okSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema
  });
}

export function paginatedSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    success: z.literal(true),
    data: z.array(itemSchema),
    pagination: offsetPaginationMetaSchema
  });
}

export function cursorPaginatedSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    success: z.literal(true),
    data: z.array(itemSchema),
    pagination: cursorPaginationMetaSchema
  });
}

export function noContentSchema() {
  return z.object({
    success: z.literal(true)
  });
}
