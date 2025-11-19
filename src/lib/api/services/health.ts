import { apiClient } from '../core/client'
import { ApiResponse } from '../core/types'

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
 * Health Check API
 */
export const healthApi = {
  /**
   * Check the health status of the API
   * @returns Promise<ApiResponse<HealthResponse>>
   *
   * @example
   * ```typescript
   * const result = await healthApi.checkHealth()
   * if (result.success) {
   *   console.log('Health status:', result.data.status)
   *   console.log('Database status:', result.data.database)
   * } else {
   *   console.error('Health check failed:', result.error.message)
   * }
   * ```
   */
  checkHealth: async (): Promise<ApiResponse<HealthResponse>> => {
    return apiClient.get<HealthResponse>('/healthz')
  },
}

export default healthApi
