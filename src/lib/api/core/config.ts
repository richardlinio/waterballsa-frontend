import { ApiResponse } from './types'

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
 * Default API client configuration
 */
export const defaultConfig: ApiClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}
