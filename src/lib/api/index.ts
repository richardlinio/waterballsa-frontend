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
export type {
  ApiError,
  ApiResponse,
  ApiClientConfig,
  HttpMethod,
  RequestOptions,
  RequestConfig,
  Interceptors,
  RetryConfig,
  HealthStatus,
  HealthResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  UserInfo,
  MissionType,
  MissionStatus,
  ContentType,
  MissionReward,
  MissionContent,
  MissionDetail,
  UserMissionProgress,
  UpdateProgressRequest,
  ProgressUpdateResponse,
  DeliverResponse,
  AccessLevel,
  MissionSummary,
  Chapter,
  JourneyListItem,
  JourneyDetail,
  JourneyListResponse,
} from '@/lib/api/api-schema'

// Export API client
export { ApiClient, apiClient, createApiClient } from './core/client'

// Export service APIs
export { healthApi } from './services/health'
export { authApi } from './services/auth'
export { missionApi } from './services/missions'
export { journeyApi } from './services/journeys'
