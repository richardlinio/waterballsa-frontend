import {
  ApiResponse,
  RequestConfig,
  ApiClientConfig,
} from '@/lib/api/api-schema'
import { getToken } from '@/lib/auth'

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
    maxRetries: 0, // Disabled for more predictable behavior during development
    retryDelay: 100,
  },
  interceptors: {
    request: defaultRequestInterceptor,
    response: defaultResponseInterceptor,
  },
}
