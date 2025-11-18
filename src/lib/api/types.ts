/**
 * API Response Types based on swagger.yaml
 */

/**
 * Health status enum
 */
export type HealthStatus = 'UP' | 'DOWN'

/**
 * Component health status
 */
export interface ComponentHealth {
  status: HealthStatus
}

/**
 * Database health details
 */
export interface DatabaseHealth extends ComponentHealth {
  details: {
    database: string
    validConnection: boolean
  }
}

/**
 * Health response components
 */
export interface HealthComponents {
  application: ComponentHealth
  database: DatabaseHealth
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: HealthStatus
  components: HealthComponents
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
