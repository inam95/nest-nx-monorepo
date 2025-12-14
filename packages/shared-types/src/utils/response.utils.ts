import type {
  CursorPaginatedResponse,
  NoContentResponse,
  OkResponse,
  PaginatedResponse
} from "../contracts/api-response.contract";
import type { CursorPaginationMeta } from "../schemas/common/pagination.schema";

// ──────────────────────────────────────────────
// Response Factory Functions
// Used by: NestJS controllers to create responses
// Could also be used by: Next.js API routes if needed
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
