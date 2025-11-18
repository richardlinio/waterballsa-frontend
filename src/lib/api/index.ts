/**
 * API Module - Entry point for all API interactions
 *
 * This module provides a centralized way to interact with the backend API.
 * It includes:
 * - Type definitions for all API responses
 * - A flexible API client with support for all HTTP methods
 * - Specific API functions for different endpoints
 *
 * @example
 * ```typescript
 * import { healthApi, apiClient } from '@/lib/api'
 *
 * // Using predefined API functions
 * const health = await healthApi.checkHealth()
 *
 * // Using the API client directly
 * const result = await apiClient.get('/some-endpoint')
 * ```
 */

// Export types
export type {
  HealthStatus,
  ComponentHealth,
  DatabaseHealth,
  HealthComponents,
  HealthResponse,
  ApiError,
  ApiResponse,
} from './types'

// Export API client
export { ApiClient, apiClient, createApiClient } from './api-client'
export type { ApiClientConfig } from './api-client'

// Export API functions
export { healthApi } from './health-api'
export { default as health } from './health-api'
