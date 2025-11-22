'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { VideoPlayer } from '@/components/mission/video-player'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { missionApi, journeyApi } from '@/lib/api'
import type {
  MissionDetail,
  UserMissionProgress,
  MissionStatus,
} from '@/lib/api'
import { toast } from 'sonner'

export default function MissionPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const journeySlug = params.journeySlug as string
  const missionId = parseInt(params.missionId as string)

  const [journeyId, setJourneyId] = useState<number | null>(null)
  const [mission, setMission] = useState<MissionDetail | null>(null)
  const [progress, setProgress] = useState<UserMissionProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDelivering, setIsDelivering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Fetch mission details and user progress
  useEffect(() => {
    async function fetchMissionData() {
      if (!user) return

      try {
        setIsLoading(true)
        setError(null)

        // First, get journey ID from slug
        const journeyResult = await journeyApi.getJourneyBySlug(journeySlug)
        if (!journeyResult.success) {
          throw new Error(
            journeyResult.error?.message || 'Failed to fetch journey'
          )
        }
        const fetchedJourneyId = journeyResult.data.id
        setJourneyId(fetchedJourneyId)

        // Fetch mission details using journey ID
        const missionResult = await missionApi.getMissionDetail(
          fetchedJourneyId,
          missionId
        )
        if (!missionResult.success) {
          throw new Error(
            missionResult.error?.message || 'Failed to fetch mission'
          )
        }
        setMission(missionResult.data)

        // Fetch user progress
        const progressResult = await missionApi.getUserMissionProgress(
          parseInt(user.id),
          missionId
        )
        if (progressResult.success) {
          setProgress(progressResult.data)
        } else {
          // If no progress exists, initialize with default values
          setProgress({
            missionId,
            status: 'UNCOMPLETED',
            watchPositionSeconds: 0,
          })
        }
      } catch (err) {
        console.error('Failed to fetch mission data:', err)
        setError('無法載入課程內容')
        toast.error('載入失敗', {
          description: '無法載入課程內容，請稍後再試',
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user && !authLoading) {
      fetchMissionData()
    }
  }, [user, authLoading, journeySlug, missionId])

  // Handle progress update
  const handleProgressUpdate = async (currentTime: number) => {
    if (!user || !mission) return

    const result = await missionApi.updateMissionProgress(
      parseInt(user.id),
      missionId,
      currentTime
    )
    if (result.success) {
      setProgress(result.data)
    } else {
      console.error('Failed to update progress:', result.error)
    }
  }

  // Handle video completion
  const handleVideoComplete = async () => {
    if (!user || !mission) return

    const videoContent = mission.content.find(c => c.type === 'video')
    const durationSeconds = videoContent?.durationSeconds || 0

    // Update progress to 100%
    const result = await missionApi.updateMissionProgress(
      parseInt(user.id),
      missionId,
      durationSeconds
    )
    if (result.success) {
      setProgress(result.data)
      toast.success('影片已觀看完畢！', {
        description: '您可以點擊「完成任務」按鈕領取獎勵',
      })
    } else {
      console.error('Failed to complete video:', result.error)
    }
  }

  // Handle mission delivery
  const handleDeliverMission = async () => {
    if (!user || !mission || !journeyId) return

    setIsDelivering(true)
    const result = await missionApi.deliverMission(journeyId, missionId)

    if (result.success) {
      // Update progress status to DELIVERED
      setProgress(prev => (prev ? { ...prev, status: 'DELIVERED' } : null))

      toast.success('任務完成！', {
        description: `獲得 ${result.data.experienceGained} 經驗值！目前等級：${result.data.currentLevel}`,
      })
    } else {
      console.error('Failed to deliver mission:', result.error)
      toast.error('完成任務失敗', {
        description: result.error?.message || '無法完成任務，請稍後再試',
      })
    }
    setIsDelivering(false)
  }

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string => {
    // If it's already just the ID
    if (!url.includes('/') && !url.includes('http')) {
      return url
    }

    // Extract from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }

    // If no pattern matches, assume it's an ID
    return url
  }

  // Get status badge
  const getStatusBadge = (status: MissionStatus) => {
    const badges = {
      UNCOMPLETED: (
        <span className="rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300">
          進行中
        </span>
      ),
      COMPLETED: (
        <span className="rounded-full bg-blue-700 px-3 py-1 text-sm text-blue-300">
          已完成
        </span>
      ),
      DELIVERED: (
        <span className="rounded-full bg-green-700 px-3 py-1 text-sm text-green-300">
          已領取獎勵
        </span>
      ),
    }
    return badges[status] || null
  }

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
        <div className="mx-auto max-w-5xl">
          <Skeleton className="mb-4 h-10 w-3/4" />
          <Skeleton className="mb-8 h-6 w-1/2" />
          <Skeleton className="mb-8 h-[480px] w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  // Error state
  if (error || !mission) {
    return (
      <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-lg bg-red-900/30 p-6 text-center text-red-400">
            <h2 className="mb-2 text-xl font-bold">載入失敗</h2>
            <p>{error || '找不到課程內容'}</p>
            <Button
              onClick={() => router.push('/')}
              className="mt-4"
              variant="outline"
            >
              返回首頁
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Get video content
  const videoContent = mission.content.find(c => c.type === 'video')

  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Mission Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">{mission.title}</h1>
            {progress && getStatusBadge(progress.status)}
          </div>
          <p className="text-lg text-gray-400">{mission.description}</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            {mission.videoLength && (
              <span>影片長度: {mission.videoLength}</span>
            )}
            <span>獎勵: {mission.reward.exp} XP</span>
          </div>
        </div>

        {/* Video Player */}
        {videoContent && mission.type === 'VIDEO' && (
          <div className="mb-8">
            <VideoPlayer
              videoId={extractYouTubeId(videoContent.url)}
              durationSeconds={videoContent.durationSeconds || 0}
              initialProgress={progress?.watchPositionSeconds || 0}
              onProgressUpdate={handleProgressUpdate}
              onComplete={handleVideoComplete}
            />
          </div>
        )}

        {/* Deliver Button */}
        {progress?.status === 'COMPLETED' && (
          <div className="mb-8">
            <Button
              onClick={handleDeliverMission}
              disabled={isDelivering}
              size="lg"
              className="w-full"
            >
              {isDelivering
                ? '處理中...'
                : `完成任務並領取 ${mission.reward.exp} XP`}
            </Button>
          </div>
        )}

        {/* Delivered Message */}
        {progress?.status === 'DELIVERED' && (
          <div className="mb-8 rounded-lg bg-green-900/30 p-6 text-center text-green-400">
            <h3 className="mb-2 text-xl font-bold">✓ 任務已完成</h3>
            <p>您已成功完成此任務並領取了獎勵！</p>
          </div>
        )}

        {/* Mission Info */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
          <h3 className="mb-4 text-xl font-bold text-white">任務資訊</h3>
          <div className="space-y-2 text-gray-400">
            <p>
              <span className="font-semibold text-gray-300">類型:</span>{' '}
              {mission.type === 'VIDEO'
                ? '影片'
                : mission.type === 'ARTICLE'
                  ? '文章'
                  : '問卷'}
            </p>
            <p>
              <span className="font-semibold text-gray-300">經驗值:</span>{' '}
              {mission.reward.exp} XP
            </p>
            {mission.isFreePreview && (
              <p className="text-green-400">🎁 免費預覽</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
