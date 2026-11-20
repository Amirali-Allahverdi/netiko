/** Django REST Framework PageNumberPagination response envelope. */
export interface PaginatedResponseDto<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Query parameters accepted by DRF's page-number paginator. */
export interface PaginationQueryDto {
  page?: number;
  page_size?: number;
}
