'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  CheckCircle,
  Lock,
  ClipboardPen,
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
import { journeyApi } from '@/lib/api'
import type { JourneyDetail, Chapter, MissionSummary } from '@/lib/api'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

function getMissionIcon(type: string) {
  switch (type) {
    case 'VIDEO':
      return Play
    case 'ARTICLE':
      return FileText
    case 'QUESTIONNAIRE':
      return ClipboardPen
    default:
      return Play
  }
}

function getMissionStatusIcon(status: string | null, accessLevel: string) {
  if (status === 'DELIVERED') {
    return <CheckCircle className="h-3 w-3 text-green-500" />
  }
  if (status === 'COMPLETED') {
    return <CheckCircle className="h-3 w-3 text-blue-500" />
  }
  if (accessLevel === 'PURCHASED') {
    return <Lock className="h-3 w-3 text-gray-500" />
  }
  return null
}

interface ChapterItemProps {
  chapter: Chapter
  journeySlug: string
  currentMissionId: number | null
}

function ChapterItem({
  chapter,
  journeySlug,
  currentMissionId,
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
}

function MissionItem({
  mission,
  journeySlug,
  chapterId,
  isActive,
}: MissionItemProps) {
  const Icon = getMissionIcon(mission.type)
  const statusIcon = getMissionStatusIcon(mission.status, mission.accessLevel)

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <Link
          href={`/journeys/${journeySlug}/chapters/${chapterId}/missions/${mission.id}`}
          className="flex items-center gap-2"
        >
          <Icon className="h-3 w-3 shrink-0" />
          <span className="flex-1 truncate text-sm">{mission.title}</span>
          {statusIcon}
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

export function JourneySidebar() {
  const params = useParams()

  const journeySlug = params.journeySlug as string
  const missionId = params.missionId
    ? parseInt(params.missionId as string)
    : null

  const [journey, setJourney] = useState<JourneyDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchJourney() {
      if (!journeySlug) return

      try {
        setIsLoading(true)
        setError(null)

        const result = await journeyApi.getJourneyBySlug(journeySlug)
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
    }

    fetchJourney()
  }, [journeySlug])

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
