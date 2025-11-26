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
} from './auth'

// User types - User profile and role models
export type { UserRole, UserProfile } from './user'

// Health types - Health check DTOs
export type { HealthStatus, HealthResponse } from './health'

// Mission types - Mission and progress tracking DTOs
export type {
  MissionType,
  MissionStatus,
  ContentType,
  MissionReward,
  MissionResource,
  MissionDetail,
  UserMissionProgress,
  UpdateProgressRequest,
  ProgressUpdateResponse,
  DeliverResponse,
} from './mission'

// Journey types - Journey, chapter, and mission summary DTOs
export type {
  AccessLevel,
  UserStatus,
  MissionSummary,
  Chapter,
  JourneyListItem,
  JourneyDetail,
  JourneyListResponse,
} from './journey'

// Order types - Order and purchase flow DTOs
export type {
  OrderStatus,
  OrderItem,
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  PayOrderResponse,
  OrderItemSummary,
  OrderSummary,
} from './order'

// User Purchase types - User's purchased journeys and orders
export type {
  PurchasedJourney,
  UserPurchasedJourneysResponse,
  Pagination,
  UserOrdersResponse,
  GetUserOrdersParams,
} from './user-purchase'
