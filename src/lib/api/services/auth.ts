import { apiClient } from '../core/client'
import {
  ApiResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
} from '@/lib/api/api-schema'

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Register a new user
   * @param data - Registration data (username and password)
   * @returns Promise<ApiResponse<RegisterResponse>>
   *
   * @example
   * ```typescript
   * const result = await authApi.register({
   *   username: 'john_doe123',
   *   password: 'SecurePass123!'
   * })
   * if (result.success) {
   *   console.log('User registered:', result.data.userId)
   * } else {
   *   console.error('Registration failed:', result.error.message)
   * }
   * ```
   */
  register: async (
    data: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> => {
    return apiClient.post<RegisterResponse, RegisterRequest>(
      '/auth/register',
      data
    )
  },

  /**
   * Login with username and password
   * @param data - Login credentials
   * @returns Promise<ApiResponse<LoginResponse>>
   *
   * @example
   * ```typescript
   * const result = await authApi.login({
   *   username: 'john_doe123',
   *   password: 'SecurePass123!'
   * })
   * if (result.success) {
   *   console.log('Access token:', result.data.accessToken)
   *   console.log('User:', result.data.user)
   * } else {
   *   console.error('Login failed:', result.error.message)
   * }
   * ```
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post<LoginResponse, LoginRequest>('/auth/login', data)
  },

  /**
   * Logout current user
   * @returns Promise<ApiResponse<LogoutResponse>>
   *
   * @example
   * ```typescript
   * const result = await authApi.logout()
   * if (result.success) {
   *   console.log('Logged out successfully')
   * } else {
   *   console.error('Logout failed:', result.error.message)
   * }
   * ```
   */
  logout: async (): Promise<ApiResponse<LogoutResponse>> => {
    return apiClient.post<LogoutResponse>('/auth/logout')
  },
}

export default authApi
