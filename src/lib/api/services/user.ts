import { apiClient } from '../core/client'
import { ApiResponse, UserProfile } from '@/lib/api/api-schema'

/**
 * User API
 */
export const userApi = {
  /**
   * Get current user profile
   * @returns Promise<ApiResponse<UserProfile>>
   *
   * @example
   * ```typescript
   * const result = await userApi.getMe()
   * if (result.success) {
   *   console.log('User profile:', result.data)
   * } else {
   *   console.error('Failed to get profile:', result.error.message)
   * }
   * ```
   */
  getMe: async (): Promise<ApiResponse<UserProfile>> => {
    return apiClient.get<UserProfile>('/users/me')
  },
}

export default userApi
