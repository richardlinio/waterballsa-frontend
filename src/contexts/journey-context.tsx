'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { journeyApi, missionApi } from '@/lib/api'
import type { JourneyDetail, MissionStatus, UserStatus } from '@/lib/api'

interface JourneyContextType {
  journey: JourneyDetail | null
  isLoading: boolean
  error: string | null
  fetchJourney: (slug: string, userId?: string) => Promise<void>
  updateMissionStatus: (missionId: number, status: MissionStatus) => void
  refreshJourneyStatus: () => Promise<void>
  userStatus: UserStatus | null
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined)

interface JourneyProviderProps {
  children: ReactNode
}

export function JourneyProvider({ children }: JourneyProviderProps) {
  const [journey, setJourney] = useState<JourneyDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null)

  const fetchJourney = useCallback(async (slug: string, userId?: string) => {
    if (!slug) return

    try {
      setIsLoading(true)
      setError(null)

      const result = await journeyApi.getJourneyBySlug(slug)
      if (result.success) {
        let journeyData = result.data

        // If userId is provided, fetch progress for all missions and merge into journey
        if (userId) {
          const allMissionIds = journeyData.chapters.flatMap(chapter =>
            chapter.missions.map(mission => mission.id)
          )

          // Fetch progress for all missions in parallel
          const progressResults = await Promise.all(
            allMissionIds.map(missionId =>
              missionApi.getUserMissionProgress(parseInt(userId), missionId)
            )
          )

          // Build missionId -> status map
          const statusMap = new Map<number, MissionStatus>()
          progressResults.forEach((progressResult, index) => {
            if (progressResult.success && progressResult.data.status) {
              statusMap.set(allMissionIds[index], progressResult.data.status)
            }
          })

          // Merge progress status into journey data
          journeyData = {
            ...journeyData,
            chapters: journeyData.chapters.map(chapter => ({
              ...chapter,
              missions: chapter.missions.map(mission => ({
                ...mission,
                status: statusMap.get(mission.id) ?? mission.status,
              })),
            })),
          }
        }

        setJourney(journeyData)
        // Extract and set userStatus if available
        setUserStatus(journeyData.userStatus ?? null)
      } else {
        setError(result.error?.message || 'Failed to load journey')
      }
    } catch {
      setError('Failed to load journey')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 更新指定任務的狀態
   *
   * 資料結構: journey → chapters[] → missions[] → status
   *
   * 因為 React 狀態需要 immutability，不能直接修改原物件，
   * 所以必須從最外層（journey）到最內層（mission）逐層建立新物件：
   * 1. 複製 journey，替換 chapters
   * 2. 複製每個 chapter，替換 missions
   * 3. 找到目標 mission 並更新其 status，其餘保持不變
   */
  const updateMissionStatus = useCallback(
    (missionId: number, status: MissionStatus) => {
      setJourney(prev => {
        if (!prev) return null

        return {
          ...prev, // 複製 journey 的其他屬性
          chapters: prev.chapters.map(chapter => ({
            ...chapter, // 複製 chapter 的其他屬性
            missions: chapter.missions.map(mission =>
              // 找到目標 mission 則更新 status，否則保持原樣
              mission.id === missionId ? { ...mission, status } : mission
            ),
          })),
        }
      })
    },
    []
  )

  /**
   * 重新取得 journey 的使用者狀態 (userStatus)
   * 用於訂單建立或付款完成後，重新整理購買狀態
   */
  const refreshJourneyStatus = useCallback(async () => {
    if (!journey) return

    try {
      const result = await journeyApi.getJourneyById(journey.id)
      if (result.success) {
        setUserStatus(result.data.userStatus ?? null)
        // Also update the journey's userStatus
        setJourney(prev =>
          prev ? { ...prev, userStatus: result.data.userStatus } : null
        )
      }
    } catch (error) {
      // Log error for debugging but don't update global error state
      // This is a background refresh operation and shouldn't disrupt the UI
      console.error('Failed to refresh journey status:', error)
    }
  }, [journey?.id])

  const value: JourneyContextType = {
    journey,
    isLoading,
    error,
    fetchJourney,
    updateMissionStatus,
    refreshJourneyStatus,
    userStatus,
  }

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  )
}

export function useJourney() {
  const context = useContext(JourneyContext)
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider')
  }
  return context
}
