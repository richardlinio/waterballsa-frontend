import {
  ApiResponse,
  RequestConfig,
  ApiClientConfig,
} from '@/lib/api/api-schema'
import { getToken } from '@/lib/auth'
import { refreshManager } from './token-refresh'

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
 * Default response interceptor with automatic token refresh on 401
 */
const defaultResponseInterceptor = async <T>(
  response: ApiResponse<T>
): Promise<ApiResponse<T>> => {
  // Check if response is 401 Unauthorized
  if (!response.success && response.error.status === 401) {
    // Attempt to refresh the token
    const refreshSuccess = await refreshManager.performRefresh()

    if (refreshSuccess) {
      // Mark response for retry with new token
      return {
        ...response,
        shouldRetry: true,
      }
    }

    // Refresh failed - let the error propagate to useApi hook for logout
  }

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
