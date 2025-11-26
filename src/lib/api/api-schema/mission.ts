/**
 * Mission-related API types
 */

export type MissionType = 'VIDEO' | 'ARTICLE' | 'QUESTIONNAIRE'
export type MissionStatus = 'UNCOMPLETED' | 'COMPLETED' | 'DELIVERED'
export type ContentType = 'video' | 'article' | 'form'

export interface MissionReward {
  exp: number
}

export interface MissionResource {
  id: number
  type: ContentType
  resourceUrl?: string
  resourceContent?: string
  durationSeconds?: number // Only for video type
}

export interface MissionDetail {
  id: number
  chapterId: number
  journeyId: number
  type: MissionType
  title: string
  description: string
  isFreePreview: boolean
  createdAt: number
  videoLength?: string // Format: MM:SS (for VIDEO type only)
  reward: MissionReward
  resource: MissionResource[]
}

export interface UserMissionProgress {
  missionId: number
  status: MissionStatus
  watchPositionSeconds: number
}

export interface UpdateProgressRequest {
  watchPositionSeconds: number
}

export interface ProgressUpdateResponse {
  missionId: number
  watchPositionSeconds: number
  status: MissionStatus
}

export interface DeliverResponse {
  message: string
  experienceGained: number
  totalExperience: number
  currentLevel: number
}
