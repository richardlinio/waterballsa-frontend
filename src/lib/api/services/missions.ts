import { apiClient } from '../core/client'
import {
  ApiResponse,
  MissionDetail,
  UserMissionProgress,
  UpdateProgressRequest,
  ProgressUpdateResponse,
  DeliverResponse,
} from '@/lib/api/api-schema'

/**
 * Mission API
 */
export const missionApi = {
  /**
   * Get mission details
   * @param journeySlug - Journey slug (URL-friendly identifier)
   * @param missionId - Mission ID
   * @returns Promise<ApiResponse<MissionDetail>>
   *
   * @example
   * ```typescript
   * const result = await missionApi.getMissionDetail('software-design-pattern', 42)
   * if (result.success) {
   *   console.log('Mission:', result.data)
   * } else {
   *   console.error('Failed to get mission:', result.error.message)
   * }
   * ```
   */
  getMissionDetail: async (
    journeySlug: string,
    missionId: number
  ): Promise<ApiResponse<MissionDetail>> => {
    return apiClient.get<MissionDetail>(
      `/journeys/${journeySlug}/missions/${missionId}`
    )
  },

  /**
   * Get user's mission progress
   * @param userId - User ID
   * @param missionId - Mission ID
   * @returns Promise<ApiResponse<UserMissionProgress>>
   *
   * @example
   * ```typescript
   * const result = await missionApi.getUserMissionProgress(123, 42)
   * if (result.success) {
   *   console.log('Progress:', result.data.watchPositionSeconds)
   * } else {
   *   console.error('Failed to get progress:', result.error.message)
   * }
   * ```
   */
  getUserMissionProgress: async (
    userId: number,
    missionId: number
  ): Promise<ApiResponse<UserMissionProgress>> => {
    return apiClient.get<UserMissionProgress>(
      `/users/${userId}/missions/${missionId}/progress`
    )
  },

  /**
   * Update user's mission progress
   * @param userId - User ID
   * @param missionId - Mission ID
   * @param watchPositionSeconds - Current watch position in seconds
   * @returns Promise<ApiResponse<ProgressUpdateResponse>>
   *
   * @example
   * ```typescript
   * const result = await missionApi.updateMissionProgress(123, 42, 150)
   * if (result.success) {
   *   console.log('Progress updated:', result.data)
   * } else {
   *   console.error('Failed to update progress:', result.error.message)
   * }
   * ```
   */
  updateMissionProgress: async (
    userId: number,
    missionId: number,
    watchPositionSeconds: number
  ): Promise<ApiResponse<ProgressUpdateResponse>> => {
    const request: UpdateProgressRequest = { watchPositionSeconds }
    return apiClient.put<ProgressUpdateResponse>(
      `/users/${userId}/missions/${missionId}/progress`,
      request
    )
  },

  /**
   * Deliver completed mission to receive experience points
   * @param journeySlug - Journey slug (URL-friendly identifier)
   * @param missionId - Mission ID
   * @returns Promise<ApiResponse<DeliverResponse>>
   *
   * @example
   * ```typescript
   * const result = await missionApi.deliverMission('software-design-pattern', 42)
   * if (result.success) {
   *   console.log('Experience gained:', result.data.experienceGained)
   * } else {
   *   console.error('Failed to deliver mission:', result.error.message)
   * }
   * ```
   */
  deliverMission: async (
    journeySlug: string,
    missionId: number
  ): Promise<ApiResponse<DeliverResponse>> => {
    return apiClient.post<DeliverResponse>(
      `/journeys/${journeySlug}/missions/${missionId}/deliver`
    )
  },
}

export default missionApi
