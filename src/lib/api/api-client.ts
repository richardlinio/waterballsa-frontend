import { ApiError, ApiResponse } from './types'

/**
 * API Client Configuration
 */
export interface ApiClientConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
}

/**
 * Default API client configuration
 */
const defaultConfig: ApiClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

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
          : { message: await response.text() }
        return {
          success: false,
          error: {
            message: errorData.message || `HTTP error ${response.status}`,
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
   * Make a GET request
   */
  async get<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout
      )

      const response = await fetch(this.buildURL(path), {
        method: 'GET',
        headers: {
          ...this.config.headers,
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      })

      clearTimeout(timeoutId)
      return this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
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
  }

  /**
   * Make a POST request
   */
  async post<T, D = unknown>(
    path: string,
    data?: D,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout
      )

      const response = await fetch(this.buildURL(path), {
        method: 'POST',
        headers: {
          ...this.config.headers,
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        ...options,
      })

      clearTimeout(timeoutId)
      return this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
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
  }

  /**
   * Make a PUT request
   */
  async put<T, D = unknown>(
    path: string,
    data?: D,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout
      )

      const response = await fetch(this.buildURL(path), {
        method: 'PUT',
        headers: {
          ...this.config.headers,
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        ...options,
      })

      clearTimeout(timeoutId)
      return this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
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
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(
    path: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout
      )

      const response = await fetch(this.buildURL(path), {
        method: 'DELETE',
        headers: {
          ...this.config.headers,
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      })

      clearTimeout(timeoutId)
      return this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
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
  }

  /**
   * Make a PATCH request
   */
  async patch<T, D = unknown>(
    path: string,
    data?: D,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout
      )

      const response = await fetch(this.buildURL(path), {
        method: 'PATCH',
        headers: {
          ...this.config.headers,
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        ...options,
      })

      clearTimeout(timeoutId)
      return this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
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
