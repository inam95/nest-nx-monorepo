export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiEmptyResponse {
  success: true;
  data: null;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
