import { z } from "zod";

import { cursorPaginationMetaSchema, offsetPaginationMetaSchema } from "../schemas/common/pagination.schema";

// ──────────────────────────────────────────────
// Response Wrapper Schema Factories
// Used by: nestjs-zod for Swagger, FE for response validation
// ──────────────────────────────────────────────

export function okResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema
  });
}

export function paginatedResponseSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    success: z.literal(true),
    data: z.array(itemSchema),
    pagination: offsetPaginationMetaSchema
  });
}

export function cursorPaginatedResponseSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    success: z.literal(true),
    data: z.array(itemSchema),
    pagination: cursorPaginationMetaSchema
  });
}

export function noContentResponseSchema() {
  return z.object({
    success: z.literal(true)
  });
}

// ──────────────────────────────────────────────
// Inferred Types (for convenience)
// ──────────────────────────────────────────────

export type OkResponse<T> = {
  success: true;
  data: T;
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: z.infer<typeof offsetPaginationMetaSchema>;
};

export type CursorPaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: z.infer<typeof cursorPaginationMetaSchema>;
};

export type NoContentResponse = {
  success: true;
};
