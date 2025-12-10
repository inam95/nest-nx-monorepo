export type ErrorType = "VALIDATION" | "BUSINESS" | "SYSTEM";

export type FieldError = {
  field: string;
  code: string;
  message: string;
};

export interface ApiErrorResponse {
  success: boolean;
  error: {
    correlationId: string;
    requestId: string;
    code: string;
    message: string;
    type: ErrorType;
    fields?: FieldError[];
    timestamp: string;
    path: string;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
