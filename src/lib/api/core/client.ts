import {
  ApiResponse,
  HttpMethod,
  RequestOptions,
  RequestConfig,
  ApiClientConfig,
} from '@/lib/api/api-schema'
import { defaultConfig } from './config'

/**
 * API Client class for making HTTP requests
 */
export class ApiClient {
  private config: ApiClientConfig

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * Build full URL from path
   */
  private buildURL(path: string): string {
    const baseURL = this.config.baseURL.replace(/\/$/, '')
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${baseURL}${normalizedPath}`
  }

  /**
   * Handle fetch response and transform to ApiResponse
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const contentType = response.headers.get('content-type')
      const isJSON = contentType?.includes('application/json')

      if (!response.ok) {
        const errorData = isJSON
          ? await response.json()
          : { error: await response.text() }
        return {
          success: false,
          error: {
            message: errorData.error || errorData.message || `HTTP error ${response.status}`,
            status: response.status,
            code: errorData.code,
          },
        }
      }

      const data = isJSON ? await response.json() : await response.text()
      return {
        success: true,
        data: data as T,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : 'Failed to parse response',
        },
      }
    }
  }

  /**
   * Check if error is a timeout error
   */
  private isTimeoutError(error: unknown): boolean {
    return error instanceof Error && error.name === 'AbortError'
  }

  /**
   * Create error response from caught error
   */
  private createErrorResponse(error: unknown): ApiResponse<never> {
    if (this.isTimeoutError(error)) {
      return {
        success: false,
        error: {
          message: 'Request timeout',
        },
      }
    }
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Network error',
      },
    }
  }

  /**
   * Check if method is idempotent (safe to retry)
   */
  private isIdempotentMethod(method: HttpMethod): boolean {
    return ['GET', 'PUT', 'DELETE'].includes(method)
  }

  /**
   * Default retry condition - retry on network errors for idempotent methods
   */
  private shouldRetry(
    method: HttpMethod,
    error: { message: string; status?: number }
  ): boolean {
    // Only retry idempotent methods
    if (!this.isIdempotentMethod(method)) {
      return false
    }

    // Use custom retry condition if provided
    if (this.config.retry?.retryOn) {
      return this.config.retry.retryOn(error)
    }

    // Default: retry on network errors (no status code)
    return !error.status
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Execute a single request attempt
   */
  private async executeRequest<T>(
    requestConfig: RequestConfig,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    // Setup timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(),
      requestConfig.timeout
    )

    try {
      // Make the request
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method,
        headers: requestConfig.headers,
        body: requestConfig.body
          ? JSON.stringify(requestConfig.body)
          : undefined,
        signal: controller.signal,
        ...options,
      })

      clearTimeout(timeoutId)
      return await this.handleResponse<T>(response)
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  /**
   * Core request method that handles all HTTP methods with retry support
   */
  private async request<T>(
    method: HttpMethod,
    path: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    // Build request configuration
    let requestConfig: RequestConfig = {
      method,
      url: this.buildURL(path),
      headers: {
        ...this.config.headers,
        ...options?.headers,
      },
      body: data,
      timeout: options?.timeout ?? this.config.timeout!,
    }

    // Apply request interceptor if configured
    if (this.config.interceptors?.request) {
      requestConfig = await this.config.interceptors.request(requestConfig)
    }

    // Retry configuration
    const maxRetries = this.config.retry!.maxRetries!
    const baseDelay = this.config.retry!.retryDelay!

    let lastError: ApiResponse<T> | null = null

    // Attempt request with retries
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Execute the request
        let result = await this.executeRequest<T>(requestConfig, options)

        // If failed and should retry
        if (
          !result.success &&
          attempt < maxRetries &&
          this.shouldRetry(method, result.error)
        ) {
          lastError = result
          // Exponential backoff: 100ms, 200ms, 400ms
          await this.sleep(baseDelay * Math.pow(2, attempt))
          continue
        }

        // Apply response interceptor if configured
        if (this.config.interceptors?.response) {
          result = await this.config.interceptors.response(result)
        }

        return result
      } catch (error) {
        const errorResponse = this.createErrorResponse(error)

        // If should retry
        // Note: createErrorResponse always returns { success: false, error: ... }
        if (
          attempt < maxRetries &&
          !errorResponse.success &&
          this.shouldRetry(method, errorResponse.error)
        ) {
          lastError = errorResponse
          // Exponential backoff
          await this.sleep(baseDelay * Math.pow(2, attempt))
          continue
        }

        return errorResponse
      }
    }

    // This should never happen, but TypeScript needs it
    return lastError ?? this.createErrorResponse(new Error('Unknown error'))
  }

  /**
   * Make a GET request
   */
  async get<T>(
    path: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, undefined, options)
  }

  /**
   * Make a POST request
   */
  async post<T, D = unknown>(
    path: string,
    data?: D,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, data, options)
  }

  /**
   * Make a PUT request
   */
  async put<T, D = unknown>(
    path: string,
    data?: D,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, data, options)
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(
    path: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path, undefined, options)
  }

  /**
   * Make a PATCH request
   */
  async patch<T, D = unknown>(
    path: string,
    data?: D,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, data, options)
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient()

/**
 * Create a custom API client with specific configuration
 */
export function createApiClient(config?: Partial<ApiClientConfig>): ApiClient {
  return new ApiClient(config)
}
