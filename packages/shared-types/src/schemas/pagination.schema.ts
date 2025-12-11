import { z } from "zod";

export const PAGINATION_DEFAULTS = {
  LIMIT: 10,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
  MIN_PAGE: 1
} as const;

export const offsetPaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(PAGINATION_DEFAULTS.MIN_PAGE).default(PAGINATION_DEFAULTS.MIN_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(PAGINATION_DEFAULTS.MIN_LIMIT)
    .max(PAGINATION_DEFAULTS.MAX_LIMIT)
    .default(PAGINATION_DEFAULTS.LIMIT)
});

export type OffsetPaginationQuery = z.infer<typeof offsetPaginationQuerySchema>;

export const cursorPaginationQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce
    .number()
    .int()
    .min(PAGINATION_DEFAULTS.MIN_LIMIT)
    .max(PAGINATION_DEFAULTS.MAX_LIMIT)
    .default(PAGINATION_DEFAULTS.LIMIT)
});

export type CursorPaginationQuery = z.infer<typeof cursorPaginationQuerySchema>;

export const offsetPaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean()
});

export type OffsetPaginationMeta = z.infer<typeof offsetPaginationMetaSchema>;

export const cursorPaginationMetaSchema = z.object({
  cursor: z.string().nullable(),
  hasMore: z.boolean(),
  limit: z.number().int().positive()
});

export type CursorPaginationMeta = z.infer<typeof cursorPaginationMetaSchema>;
