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

// Export core types
export type { ApiError, ApiResponse } from './core/types'
export type { ApiClientConfig } from './core/config'

// Export API client
export { ApiClient, apiClient, createApiClient } from './core/client'

// Export service APIs and their types
export { healthApi } from './services/health'
export { default as health } from './services/health'
export type { HealthStatus, HealthResponse } from './services/health'

export { authApi } from './services/auth'
export { default as auth } from './services/auth'
export type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  UserInfo,
} from './services/auth'
