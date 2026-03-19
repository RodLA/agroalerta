export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  meta: {
    totalElements: number
    totalItems: number
    totalPages: number
    page: number
    size: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  timestamp: string
}
