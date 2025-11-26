'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronRight,
  PlayCircle,
  FileText,
  ClipboardList,
  Lock,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { useUserPurchase } from '@/contexts/user-purchase-context'
import { useAuth } from '@/contexts/auth-context'
import type { Chapter, MissionSummary } from '@/lib/api/api-schema'

function getMissionTypeIcon(type: MissionSummary['type']) {
  switch (type) {
    case 'VIDEO':
      return <PlayCircle className="h-5 w-5 text-muted-foreground" />
    case 'ARTICLE':
      return <FileText className="h-5 w-5 text-muted-foreground" />
    case 'QUESTIONNAIRE':
      return <ClipboardList className="h-5 w-5 text-muted-foreground" />
    default:
      return <PlayCircle className="h-5 w-5 text-muted-foreground" />
  }
}

interface JourneyChapterListProps {
  chapters: Chapter[]
  journeySlug: string
  journeyId: number
}

export function JourneyChapterList({
  chapters,
  journeySlug,
  journeyId,
}: JourneyChapterListProps) {
  return (
    <div className="space-y-4">
      {chapters.map(chapter => (
        <ChapterCollapsible
          key={chapter.id}
          chapter={chapter}
          journeySlug={journeySlug}
          journeyId={journeyId}
        />
      ))}
    </div>
  )
}

interface ChapterCollapsibleProps {
  chapter: Chapter
  journeySlug: string
  journeyId: number
}

function ChapterCollapsible({
  chapter,
  journeySlug,
  journeyId,
}: ChapterCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { hasPurchased } = useUserPurchase()
  const { isAuthenticated } = useAuth()

  const isPurchased = isAuthenticated ? hasPurchased(journeyId) : false

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border border-border bg-card">
        <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left">
          <h3 className="text-lg font-semibold text-foreground">
            {chapter.title}
          </h3>
          {isOpen ? (
            <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border">
            {chapter.missions.map(mission => (
              <Link
                key={mission.id}
                href={`/journeys/${journeySlug}/chapters/${chapter.id}/missions/${mission.id}`}
                className="flex items-center justify-between border-b border-border px-6 py-4 last:border-b-0 hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  {getMissionTypeIcon(mission.type)}
                  <span className="text-foreground">{mission.title}</span>
                  {mission.accessLevel === 'PUBLIC' && (
                    <Badge variant="secondary" className="text-xs">
                      試看單元
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {mission.accessLevel === 'PURCHASED' && !isPurchased && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
