'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronDown,
  ChevronRight,
  Circle,
  CheckCircle,
  Lock,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Logo } from '@/components/logo'
import { useJourney } from '@/contexts/journey-context'
import { useAuth } from '@/contexts/auth-context'
import { useUserPurchase } from '@/contexts/user-purchase-context'
import type { Chapter, MissionSummary } from '@/lib/api'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

function getMissionStatusIcon(status: string | null) {
  if (status === 'DELIVERED') {
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }
  if (status === 'COMPLETED') {
    return <CheckCircle className="h-4 w-4" />
  }
  // UNCOMPLETED or null - dashed circle
  return <Circle className="h-4 w-4 text-gray-500" strokeDasharray="3 3" />
}

interface ChapterItemProps {
  chapter: Chapter
  journeySlug: string
  currentMissionId: number | null
  isPurchased: boolean
}

function ChapterItem({
  chapter,
  journeySlug,
  currentMissionId,
  isPurchased,
}: ChapterItemProps) {
  const hasCurrentMission = chapter.missions.some(
    m => m.id === currentMissionId
  )
  const [isOpen, setIsOpen] = useState(hasCurrentMission)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full justify-between">
            <span className="truncate font-medium">{chapter.title}</span>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {chapter.missions.map(mission => (
              <MissionItem
                key={mission.id}
                mission={mission}
                journeySlug={journeySlug}
                chapterId={chapter.id}
                isActive={mission.id === currentMissionId}
                isPurchased={isPurchased}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

interface MissionItemProps {
  mission: MissionSummary
  journeySlug: string
  chapterId: number
  isActive: boolean
  isPurchased: boolean
}

function MissionItem({
  mission,
  journeySlug,
  chapterId,
  isActive,
  isPurchased,
}: MissionItemProps) {
  const shouldShowLock = mission.accessLevel === 'PURCHASED' && !isPurchased
  const statusIcon = shouldShowLock ? (
    <Lock className="h-4 w-4 text-muted-foreground" />
  ) : (
    getMissionStatusIcon(mission.status)
  )

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <Link
          href={`/journeys/${journeySlug}/chapters/${chapterId}/missions/${mission.id}`}
          className="flex items-center gap-2"
        >
          {statusIcon}
          <span className="flex-1 truncate text-sm">{mission.title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

export function JourneySidebar() {
  const params = useParams()
  const { journey, isLoading, error, fetchJourney } = useJourney()
  const { user } = useAuth()
  const { hasPurchased } = useUserPurchase()

  const journeySlug = params.journeySlug as string
  const missionId = params.missionId
    ? parseInt(params.missionId as string)
    : null

  const isPurchased = journey ? hasPurchased(journey.id) : false

  useEffect(() => {
    if (journeySlug && (!journey || journey.slug !== journeySlug)) {
      fetchJourney(journeySlug, user?.id)
    }
  }, [journeySlug, journey, fetchJourney, user?.id])

  return (
    <Sidebar className="border-r bg-sidebar">
      <SidebarHeader>
        <Link href="/" className="p-2">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-400">{error}</div>
        ) : journey ? (
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-2">
              <span className="truncate text-sm font-semibold">
                {journey.title}
              </span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {journey.chapters.map(chapter => (
                  <ChapterItem
                    key={chapter.id}
                    chapter={chapter}
                    journeySlug={journeySlug}
                    currentMissionId={missionId}
                    isPurchased={isPurchased}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>
    </Sidebar>
  )
}
