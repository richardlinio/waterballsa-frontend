'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useJourney } from '@/contexts/journey-context'
import { useUserPurchase } from '@/contexts/user-purchase-context'
import { missionApi } from '@/lib/api'
import type { MissionDetail, UserMissionProgress } from '@/lib/api'
import { toast } from 'sonner'

export interface UseMissionReturn {
  mission: MissionDetail | null
  progress: UserMissionProgress | null
  isLoading: boolean
  isDelivering: boolean
  error: string | null
  isPurchaseRequired: boolean
  handleProgressUpdate: (currentTime: number) => Promise<void>
  handleVideoComplete: () => void
  handleDeliverMission: () => Promise<void>
}

export function useMission(): UseMissionReturn {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { journey, updateMissionStatus } = useJourney()
  const { hasPurchased, isLoading: purchaseLoading } = useUserPurchase()

  const missionId = parseInt(params.missionId as string)

  // Extract journeyId to use as dependency instead of journey object
  // This prevents re-fetching on every journey object reference change
  const journeyId = journey?.id

  const [mission, setMission] = useState<MissionDetail | null>(null)
  const [progress, setProgress] = useState<UserMissionProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDelivering, setIsDelivering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPurchaseRequired, setIsPurchaseRequired] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Fetch mission details and user progress
  useEffect(() => {
    async function fetchMissionData() {
      if (!user || !journey || !journeyId) return

      try {
        setIsLoading(true)
        setError(null)
        setIsPurchaseRequired(false) // Reset state

        // Use journey data from context instead of fetching again
        const fetchedJourneyId = journeyId

        // Find mission summary to check access level BEFORE fetching details
        const missionSummary = journey.chapters
          .flatMap(chapter => chapter.missions)
          .find(m => m.id === missionId)

        // PRE-CHECK: If content requires purchase and user hasn't purchased
        if (
          missionSummary &&
          missionSummary.accessLevel === 'PURCHASED' &&
          !hasPurchased(fetchedJourneyId)
        ) {
          // Set purchase required state WITHOUT fetching mission details
          setIsPurchaseRequired(true)
          setMission(null)
          setProgress({
            missionId,
            status: 'UNCOMPLETED',
            watchPositionSeconds: 0,
          })
          return // Exit early - don't call getMissionDetail API
        }

        // Only fetch mission details if access is granted
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
          // Sync status to JourneyContext so sidebar shows correct state
          if (progressResult.data.status) {
            updateMissionStatus(missionId, progressResult.data.status)
          }
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

    if (user && !authLoading && journeyId) {
      fetchMissionData()
    }
    // We intentionally use journeyId instead of journey to avoid re-fetching on every journey object reference change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    authLoading,
    journeyId,
    missionId,
    updateMissionStatus,
    hasPurchased,
  ])

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
      console.error('Failed to update progress:', result.error?.message)
      toast.error('進度保存失敗', {
        description: result.error?.message || '無法保存進度，請檢查網路連線',
      })
    }
  }

  // Handle video completion (called by useVideoProgress after progress is already updated)
  const handleVideoComplete = () => {
    if (!user || !mission) return

    // Don't show toast if already completed or delivered
    if (progress?.status === 'COMPLETED' || progress?.status === 'DELIVERED') {
      return
    }

    // Update sidebar status to COMPLETED
    updateMissionStatus(missionId, 'COMPLETED')
    // Update local progress state
    setProgress(prev => (prev ? { ...prev, status: 'COMPLETED' } : null))

    toast.success('影片已觀看完畢！', {
      description: '您可以點擊「完成任務」按鈕領取獎勵',
    })
  }

  // Handle mission delivery
  const handleDeliverMission = async () => {
    if (!user || !mission) return

    setIsDelivering(true)
    const result = await missionApi.deliverMission(parseInt(user.id), missionId)

    if (result.success) {
      // Update progress status to DELIVERED
      setProgress(prev => (prev ? { ...prev, status: 'DELIVERED' } : null))
      // Update sidebar status
      updateMissionStatus(missionId, 'DELIVERED')

      toast.success('任務完成！', {
        description: `獲得 ${result.data.experienceGained} 經驗值！目前等級：${result.data.currentLevel}`,
      })
    } else {
      console.error('Failed to deliver mission:', result.error?.message)
      toast.error('完成任務失敗', {
        description: result.error?.message || '無法完成任務，請稍後再試',
      })
    }
    setIsDelivering(false)
  }

  return {
    mission,
    progress,
    isLoading: authLoading || isLoading || purchaseLoading,
    isDelivering,
    error,
    isPurchaseRequired,
    handleProgressUpdate,
    handleVideoComplete,
    handleDeliverMission,
  }
}
