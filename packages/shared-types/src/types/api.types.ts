import type {
  CursorPaginatedResponse,
  NoContentResponse,
  OkResponse,
  PaginatedResponse
} from "../contracts/api-response.contract";

// ──────────────────────────────────────────────
// Error Types (not Zod - these are for error handling)
// ──────────────────────────────────────────────

export type ErrorType = "VALIDATION" | "BUSINESS" | "SYSTEM";

export interface FieldError {
  field: string;
  code: string;
  message: string;
}

export interface ApiError {
  correlationId: string;
  requestId: string;
  code: string;
  message: string;
  type: ErrorType;
  fields?: FieldError[];
  timestamp: string;
  path: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

// ──────────────────────────────────────────────
// Union Types for API Responses
// ──────────────────────────────────────────────

export type ApiResponse<T> = OkResponse<T> | ApiErrorResponse;
export type ApiPaginatedResponse<T> = PaginatedResponse<T> | ApiErrorResponse;
export type ApiCursorPaginatedResponse<T> = CursorPaginatedResponse<T> | ApiErrorResponse;
export type ApiNoContentResponse = NoContentResponse | ApiErrorResponse;
