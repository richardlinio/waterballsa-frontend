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
