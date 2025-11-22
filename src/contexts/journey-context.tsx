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

  const updateMissionStatus = useCallback(
    (missionId: number, status: MissionStatus) => {
      setJourney(prev => {
        if (!prev) return null

        return {
          ...prev,
          chapters: prev.chapters.map(chapter => ({
            ...chapter,
            missions: chapter.missions.map(mission =>
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
