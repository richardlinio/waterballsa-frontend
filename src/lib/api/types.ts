/**
 * API Response Types based on swagger.yaml
 */

/**
 * Health status enum
 */
export type HealthStatus = 'UP' | 'DOWN'

/**
 * Health check response
 * Simple format matching backend implementation
 */
export interface HealthResponse {
  status: HealthStatus
  database: HealthStatus
}

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
    }
