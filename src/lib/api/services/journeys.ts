import { apiClient } from '../core/client'
import type { ApiResponse, JourneyDetail, JourneyListResponse } from '@/lib/api/api-schema'

/**
 * Journey API
 */
export const journeyApi = {
  /**
   * Get all journeys
   * @returns Promise<ApiResponse<JourneyListResponse>>
   *
   * @example
   * ```typescript
   * const result = await journeyApi.getJourneyList()
   * if (result.success) {
   *   console.log('Journeys:', result.data.journeys)
   * } else {
   *   console.error('Failed to get journeys:', result.error.message)
   * }
   * ```
   */
  getJourneyList: async (): Promise<ApiResponse<JourneyListResponse>> => {
    return apiClient.get<JourneyListResponse>('/journeys')
  },

  /**
   * Get journey details by slug
   * @param slug - Journey slug (URL-friendly identifier)
   * @returns Promise<ApiResponse<JourneyDetail>>
   *
   * @example
   * ```typescript
   * const result = await journeyApi.getJourneyBySlug('software-design-pattern')
   * if (result.success) {
   *   console.log('Journey:', result.data)
   * } else {
   *   console.error('Failed to get journey:', result.error.message)
   * }
   * ```
   */
  getJourneyBySlug: async (slug: string): Promise<ApiResponse<JourneyDetail>> => {
    return apiClient.get<JourneyDetail>(`/journeys/${slug}`)
  },
}

export default journeyApi
