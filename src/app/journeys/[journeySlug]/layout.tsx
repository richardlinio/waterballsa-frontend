'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Header } from '@/components/layout/header'
import { JourneySidebar } from '@/components/layout/journey-sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { journeyApi } from '@/lib/api'
import type { JourneyDetail } from '@/lib/api'

export default function JourneyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const journeySlug = params.journeySlug as string
  const chapterId = params.chapterId
    ? parseInt(params.chapterId as string)
    : undefined
  const missionId = params.missionId
    ? parseInt(params.missionId as string)
    : undefined

  const [journey, setJourney] = useState<JourneyDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchJourney() {
      try {
        setIsLoading(true)
        const result = await journeyApi.getJourneyBySlug(journeySlug)
        if (result.success) {
          setJourney(result.data)
        } else {
          console.error('Failed to fetch journey:', result.error)
        }
      } catch (error) {
        console.error('Failed to fetch journey:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJourney()
  }, [journeySlug])

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-64 flex-col border-r bg-sidebar p-4">
          <Skeleton className="mb-6 h-10 w-full" />
          <Skeleton className="mb-2 h-8 w-full" />
          <Skeleton className="mb-2 h-8 w-full" />
          <Skeleton className="mb-2 h-8 w-full" />
        </div>
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!journey) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-64 flex-col items-center justify-center border-r bg-sidebar p-4">
          <p className="text-sm text-muted-foreground">無法載入課程</p>
        </div>
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <JourneySidebar
        journeySlug={journeySlug}
        chapters={journey.chapters}
        currentMissionId={missionId}
        currentChapterId={chapterId}
      />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
