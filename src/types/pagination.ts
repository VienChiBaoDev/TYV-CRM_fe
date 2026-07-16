export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 20

export interface PaginatedMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginatedMeta
}
