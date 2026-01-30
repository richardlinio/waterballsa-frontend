/**
 * Generic API error response
 */
export interface ApiError {
  message: string
  status?: number
  code?: string
}

/**
 * API response wrapper
 */
export type ApiResponse<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: ApiError
      shouldRetry?: boolean
    }
