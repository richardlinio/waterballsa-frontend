import { apiClient } from '../core/client'
import type {
  ApiResponse,
  UserPurchasedJourneysResponse,
  UserOrdersResponse,
  GetUserOrdersParams,
} from '@/lib/api/api-schema'

/**
 * User Purchase API
 * Handles fetching user's purchased journeys and orders
 */
export const userPurchaseApi = {
  /**
   * Get user's purchased journeys (PAID orders only)
   * @param userId - User ID
   * @returns Promise<ApiResponse<UserPurchasedJourneysResponse>>
   */
  getUserPurchasedJourneys: async (
    userId: number
  ): Promise<ApiResponse<UserPurchasedJourneysResponse>> => {
    return apiClient.get<UserPurchasedJourneysResponse>(
      `/users/${userId}/journeys`
    )
  },

  /**
   * Get user's orders with pagination and optional filtering
   * @param userId - User ID
   * @param params - Query parameters (page, limit, status)
   * @returns Promise<ApiResponse<UserOrdersResponse>>
   */
  getUserOrders: async (
    userId: number,
    params: GetUserOrdersParams = { page: 1, limit: 20 }
  ): Promise<ApiResponse<UserOrdersResponse>> => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.status) queryParams.append('status', params.status)

    const queryString = queryParams.toString()
    const endpoint = `/users/${userId}/orders${queryString ? `?${queryString}` : ''}`

    return apiClient.get<UserOrdersResponse>(endpoint)
  },
}

export default userPurchaseApi
