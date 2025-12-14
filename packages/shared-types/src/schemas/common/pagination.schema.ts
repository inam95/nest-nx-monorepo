import { z } from "zod";

import { PAGINATION } from "../../constants/pagination.constants";

// ──────────────────────────────────────────────
// Query Schemas (for request validation)
// ──────────────────────────────────────────────

export const offsetPaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(PAGINATION.MIN_PAGE).default(PAGINATION.MIN_PAGE),
  limit: z.coerce.number().int().min(PAGINATION.MIN_LIMIT).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT)
});

export const cursorPaginationQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(PAGINATION.MIN_LIMIT).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT)
});

// ──────────────────────────────────────────────
// Meta Schemas (for response structure)
// ──────────────────────────────────────────────

export const offsetPaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean()
});

export const cursorPaginationMetaSchema = z.object({
  cursor: z.string().nullable(),
  hasMore: z.boolean(),
  limit: z.number().int().positive()
});

// ──────────────────────────────────────────────
// Inferred Types
// ──────────────────────────────────────────────

export type OffsetPaginationQuery = z.infer<typeof offsetPaginationQuerySchema>;
export type CursorPaginationQuery = z.infer<typeof cursorPaginationQuerySchema>;
export type OffsetPaginationMeta = z.infer<typeof offsetPaginationMetaSchema>;
export type CursorPaginationMeta = z.infer<typeof cursorPaginationMetaSchema>;
