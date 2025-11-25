/**
 * Journey-related API types
 */

import type { MissionType, MissionStatus } from './mission'

export type AccessLevel = 'PUBLIC' | 'AUTHENTICATED' | 'PURCHASED'

export interface UserStatus {
  hasPurchased: boolean
  hasUnpaidOrder: boolean
  unpaidOrderId: number | null
}

export interface MissionSummary {
  id: number
  type: MissionType
  title: string
  accessLevel: AccessLevel
  orderIndex: number
  status: MissionStatus | null
}

export interface Chapter {
  id: number
  title: string
  orderIndex: number
  missions: MissionSummary[]
}

export interface JourneyListItem {
  id: number
  slug: string
  title: string
  description: string
  coverImageUrl: string
  teacherName: string
}

export interface JourneyDetail {
  id: number
  slug: string
  title: string
  description: string
  coverImageUrl: string
  teacherName: string
  chapters: Chapter[]
  userStatus?: UserStatus // Optional, only present when user is authenticated
}

export interface JourneyListResponse {
  journeys: JourneyListItem[]
}
