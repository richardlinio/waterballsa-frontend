'use client'

import { useMission } from '@/hooks/use-mission'
import { useVideoProgress } from '@/hooks/use-video-progress'
import { VideoPlayer } from '@/components/mission/video-player'
import { MissionHeader } from '@/components/mission/mission-header'
import { MissionDeliverButton } from '@/components/mission/mission-deliver-button'
import { MissionDeliveredMessage } from '@/components/mission/mission-delivered-message'
import { MissionInfo } from '@/components/mission/mission-info'
import { MissionLoadingSkeleton } from '@/components/mission/mission-loading-skeleton'
import { MissionErrorState } from '@/components/mission/mission-error-state'
import { extractYouTubeId } from '@/lib/youtube'

export default function MissionPage() {
  const {
    mission,
    progress,
    isLoading,
    isDelivering,
    error,
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

  if (isLoading) {
    return <MissionLoadingSkeleton />
  }

  if (error || !mission) {
    return <MissionErrorState error={error} />
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
