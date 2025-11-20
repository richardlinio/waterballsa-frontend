import { ApiResponse } from './types'
import { getToken } from '@/lib/auth'

/**
 * HTTP methods supported by the API client
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * Extended request options with custom timeout support
 */
export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
  timeout?: number
}

/**
 * Request configuration for interceptors
 */
export interface RequestConfig {
  method: HttpMethod
  url: string
  headers: Record<string, string>
  body?: unknown
  timeout: number
}

/**
 * Interceptors for request and response transformation
 */
export interface Interceptors {
  request?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
  response?: <T>(
    response: ApiResponse<T>
  ) => ApiResponse<T> | Promise<ApiResponse<T>>
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries?: number
  retryDelay?: number
  retryOn?: (error: { message: string; status?: number }) => boolean
}

/**
 * API Client Configuration
 */
export interface ApiClientConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  interceptors?: Interceptors
  retry?: RetryConfig
}

/**
 * Default request interceptor - adds Authorization header if token exists
 */
const defaultRequestInterceptor = (
  config: RequestConfig
): RequestConfig | Promise<RequestConfig> => {
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}

/**
 * Default response interceptor
 * Note: 401 handling is delegated to the application layer (useApi hook)
 */
const defaultResponseInterceptor = <T>(
  response: ApiResponse<T>
): ApiResponse<T> => {
  // Can be used for logging or other cross-cutting concerns
  return response
}

/**
 * Default API client configuration
 */
export const defaultConfig: ApiClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  retry: {
    maxRetries: 3,
    retryDelay: 100,
  },
  interceptors: {
    request: defaultRequestInterceptor,
    response: defaultResponseInterceptor,
  },
}
