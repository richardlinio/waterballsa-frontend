import { apiClient } from './api-client'
import { HealthResponse, ApiResponse } from './types'

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
