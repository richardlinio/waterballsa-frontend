'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useParams } from 'next/navigation'
import { useJourney } from '@/contexts/journey-context'
import { useAuth } from '@/contexts/auth-context'
import { MissionLoadingSkeleton } from '@/components/mission/mission-loading-skeleton'

export default function MissionLayout({ children }: { children: ReactNode }) {
  const params = useParams()
  const { journey, isLoading, error, fetchJourney } = useJourney()
  const { user } = useAuth()

  const journeySlug = params.journeySlug as string

  // Use ref to track if we've fetched for this slug to avoid re-fetching on every journey update
  const fetchedSlugRef = useRef<string | null>(null)

  // Preload journey data to ensure JourneyContext has data before MissionPage renders
  useEffect(() => {
    if (journeySlug && fetchedSlugRef.current !== journeySlug) {
      fetchJourney(journeySlug, user?.id)
      fetchedSlugRef.current = journeySlug
    }
  }, [journeySlug, fetchJourney, user?.id])

  // Wait for journey to load before rendering children
  // This ensures useMission can safely access journey from context
  if (isLoading || !journey || journey.slug !== journeySlug) {
    return <MissionLoadingSkeleton />
  }

  // If there's an error loading journey, show error state
  if (error) {
    return (
      <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-destructive">
              載入課程失敗
            </h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
