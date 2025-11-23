/**
 * Centralized API Schema Exports
 * All API-related types and interfaces are organized here
 */

// Common types - API infrastructure
export type { ApiError, ApiResponse } from './common'

// Config types - HTTP client configuration
export type {
  HttpMethod,
  RequestOptions,
  RequestConfig,
  Interceptors,
  RetryConfig,
  ApiClientConfig,
} from './config'

// Auth types - Authentication related DTOs and models
export type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  UserInfo,
  LoginResponse,
  LogoutResponse,
  UserRole,
  UserProfile,
} from './auth'

// Health types - Health check DTOs
export type { HealthStatus, HealthResponse } from './health'

// Mission types - Mission and progress tracking DTOs
export type {
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
} from './mission'

// Journey types - Journey, chapter, and mission summary DTOs
export type {
  AccessLevel,
  MissionSummary,
  Chapter,
  JourneyListItem,
  JourneyDetail,
  JourneyListResponse,
} from './journey'
