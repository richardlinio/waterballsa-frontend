'use client'

import Link from 'next/link'
import { ChevronDown, Lock } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Logo } from '@/components/logo'
import { MissionStatusIcon } from '@/components/mission/mission-status-icon'
import { useUserPurchase } from '@/contexts/user-purchase-context'
import type { Chapter } from '@/lib/api'
import { cn } from '@/lib/utils'

interface JourneySidebarProps {
  journeySlug: string
  chapters: Chapter[]
  currentMissionId?: number
  currentChapterId?: number
  journeyId: number
}

export function JourneySidebar({
  journeySlug,
  chapters,
  currentMissionId,
  currentChapterId,
  journeyId,
}: JourneySidebarProps) {
  const { hasPurchased } = useUserPurchase()
  const isPurchased = hasPurchased(journeyId)

  return (
    <Sidebar className="border-r bg-sidebar">
      <SidebarHeader>
        <Link href="/" className="p-2">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {chapters
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map(chapter => (
                  <Collapsible
                    key={chapter.id}
                    defaultOpen={chapter.id === currentChapterId}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full justify-between">
                          <span className="truncate text-sm font-medium">
                            {chapter.title}
                          </span>
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {chapter.missions
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map(mission => {
                              const isActive = mission.id === currentMissionId
                              const missionUrl = `/journeys/${journeySlug}/chapters/${chapter.id}/missions/${mission.id}`
                              const shouldShowLock =
                                mission.accessLevel === 'PURCHASED' &&
                                !isPurchased

                              return (
                                <SidebarMenuSubItem key={mission.id}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isActive}
                                  >
                                    <Link
                                      href={missionUrl}
                                      className={cn(
                                        'flex items-center gap-2',
                                        isActive && 'font-medium'
                                      )}
                                    >
                                      {shouldShowLock ? (
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <MissionStatusIcon
                                          status={mission.status}
                                        />
                                      )}
                                      <span className="truncate text-sm">
                                        {mission.title}
                                      </span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
