import type { CursorPaginationMeta, OffsetPaginationMeta } from "../../schemas";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface OkResponse<T> {
  success: true;
  data: T;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: OffsetPaginationMeta;
}

export interface CursorPaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: CursorPaginationMeta;
}

export interface NoContentResponse {
  success: true;
}

// ──────────────────────────────────────────────
// Utility Functions
// ──────────────────────────────────────────────

export function ok<T>(data: T): OkResponse<T> {
  return {
    success: true,
    data
  };
}

export function paginated<T>(data: T[], meta: { page: number; limit: number; total: number }): PaginatedResponse<T> {
  const totalPages = Math.ceil(meta.total / meta.limit);

  return {
    success: true,
    data,
    pagination: {
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      totalPages,
      hasNext: meta.page < totalPages,
      hasPrevious: meta.page > 1
    }
  };
}

export function cursorPaginated<T>(data: T[], meta: CursorPaginationMeta): CursorPaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination: meta
  };
}

export function noContent(): NoContentResponse {
  return {
    success: true
  };
}
