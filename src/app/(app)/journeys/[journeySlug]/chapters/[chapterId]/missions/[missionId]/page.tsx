'use client'

import { useParams, useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { useMission } from '@/hooks/use-mission'
import { useVideoProgress } from '@/hooks/use-video-progress'
import { VideoPlayer } from '@/components/mission/video-player'
import { MissionHeader } from '@/components/mission/mission-header'
import { MissionDeliverButton } from '@/components/mission/mission-deliver-button'
import { MissionDeliveredMessage } from '@/components/mission/mission-delivered-message'
import { MissionInfo } from '@/components/mission/mission-info'
import { MissionLoadingSkeleton } from '@/components/mission/mission-loading-skeleton'
import { MissionErrorState } from '@/components/mission/mission-error-state'
import { Button } from '@/components/ui/button'
import { extractYouTubeId } from '@/lib/youtube'

function LockedContentMessage({ journeySlug }: { journeySlug: string }) {
  const router = useRouter()

  return (
    <div className="mb-8 flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-12">
      <Lock className="mb-4 h-16 w-16 text-muted-foreground" />
      <h3 className="mb-2 text-xl font-semibold text-foreground">
        此為付費內容
      </h3>
      <p className="mb-6 text-center text-muted-foreground">
        請先購買課程以解鎖完整內容
      </p>
      <Button onClick={() => router.push(`/journeys/${journeySlug}`)} size="lg">
        購買課程
      </Button>
    </div>
  )
}

export default function MissionPage() {
  const params = useParams()
  const journeySlug = params.journeySlug as string

  const {
    mission,
    progress,
    isLoading,
    isDelivering,
    error,
    isPurchaseRequired,
    handleProgressUpdate,
    handleVideoComplete,
    handleDeliverMission,
  } = useMission()

  const videoResource = mission?.resource?.find(r => r.type === 'video')

  const { isCompleted, playerHandlers } = useVideoProgress({
    initialProgress: progress?.watchPositionSeconds ?? 0,
    durationSeconds: videoResource?.durationSeconds ?? 0,
    onProgressUpdate: handleProgressUpdate,
    onComplete: handleVideoComplete,
  })

  // Use isPurchaseRequired from hook
  const isContentLocked = isPurchaseRequired

  if (isLoading) {
    return <MissionLoadingSkeleton />
  }

  if (error) {
    return <MissionErrorState error={error} />
  }

  // Show locked content UI even when mission is null
  if (isContentLocked) {
    return (
      <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
        <div className="mx-auto max-w-5xl">
          <LockedContentMessage journeySlug={journeySlug} />
        </div>
      </div>
    )
  }

  if (!mission) {
    return <MissionErrorState error="找不到課程內容" />
  }

  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      <div className="mx-auto max-w-5xl">
        <MissionHeader mission={mission} />

        {videoResource && mission.type === 'VIDEO' && (
          <div className="mb-8">
            <VideoPlayer
              videoId={extractYouTubeId(videoResource.resourceUrl)}
              isCompleted={isCompleted}
              {...playerHandlers}
            />
          </div>
        )}

        {progress?.status === 'COMPLETED' && (
          <MissionDeliverButton
            expReward={mission.reward.exp}
            isDelivering={isDelivering}
            onDeliver={handleDeliverMission}
          />
        )}

        {progress?.status === 'DELIVERED' && <MissionDeliveredMessage />}

        <MissionInfo mission={mission} />
      </div>
    </div>
  )
}
