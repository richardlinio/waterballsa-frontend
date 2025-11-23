'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { journeyApi } from '@/lib/api'
import type { JourneyDetail, MissionStatus } from '@/lib/api'

interface JourneyContextType {
  journey: JourneyDetail | null
  isLoading: boolean
  error: string | null
  fetchJourney: (slug: string) => Promise<void>
  updateMissionStatus: (missionId: number, status: MissionStatus) => void
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined)

interface JourneyProviderProps {
  children: ReactNode
}

export function JourneyProvider({ children }: JourneyProviderProps) {
  const [journey, setJourney] = useState<JourneyDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchJourney = useCallback(async (slug: string) => {
    if (!slug) return

    try {
      setIsLoading(true)
      setError(null)

      const result = await journeyApi.getJourneyBySlug(slug)
      if (result.success) {
        setJourney(result.data)
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

  const value: JourneyContextType = {
    journey,
    isLoading,
    error,
    fetchJourney,
    updateMissionStatus,
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
