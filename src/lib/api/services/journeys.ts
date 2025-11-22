import { apiClient } from '../core/client'
import type {
  ApiResponse,
  JourneyDetail,
  JourneyListResponse,
} from '@/lib/api/api-schema'

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
   * Get journey details by ID
   * @param journeyId - Journey ID
   * @returns Promise<ApiResponse<JourneyDetail>>
   *
   * @example
   * ```typescript
   * const result = await journeyApi.getJourneyById(1)
   * if (result.success) {
   *   console.log('Journey:', result.data)
   * } else {
   *   console.error('Failed to get journey:', result.error.message)
   * }
   * ```
   */
  getJourneyById: async (
    journeyId: number
  ): Promise<ApiResponse<JourneyDetail>> => {
    return apiClient.get<JourneyDetail>(`/journeys/${journeyId}`)
  },

  /**
   * Get journey details by slug (helper method)
   * This method first fetches the journey list to find the ID, then fetches the detail
   * @param slug - Journey slug (URL-friendly identifier)
   * @returns Promise<ApiResponse<JourneyDetail>>
   *
   * @example
   * ```typescript
   * const result = await journeyApi.getJourneyBySlug('design-patterns-mastery')
   * if (result.success) {
   *   console.log('Journey:', result.data)
   * } else {
   *   console.error('Failed to get journey:', result.error.message)
   * }
   * ```
   */
  getJourneyBySlug: async (
    slug: string
  ): Promise<ApiResponse<JourneyDetail>> => {
    // First, get the journey list to find the ID
    const listResult = await journeyApi.getJourneyList()
    if (!listResult.success) {
      return listResult as ApiResponse<JourneyDetail>
    }

    // Find the journey with matching slug
    const journey = listResult.data.journeys.find(j => j.slug === slug)
    if (!journey) {
      return {
        success: false,
        error: {
          message: `Journey with slug "${slug}" not found`,
          status: 404,
        },
      }
    }

    // Fetch the full journey details using the ID
    return journeyApi.getJourneyById(journey.id)
  },
}

export default journeyApi
