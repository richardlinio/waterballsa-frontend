'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, PlayCircle } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { Chapter } from '@/lib/api/api-schema'

interface JourneyChapterListProps {
  chapters: Chapter[]
  journeySlug: string
}

export function JourneyChapterList({
  chapters,
  journeySlug,
}: JourneyChapterListProps) {
  return (
    <div className="space-y-4">
      {chapters.map(chapter => (
        <ChapterCollapsible
          key={chapter.id}
          chapter={chapter}
          journeySlug={journeySlug}
        />
      ))}
    </div>
  )
}

interface ChapterCollapsibleProps {
  chapter: Chapter
  journeySlug: string
}

function ChapterCollapsible({ chapter, journeySlug }: ChapterCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false)

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
                  <PlayCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">{mission.title}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
