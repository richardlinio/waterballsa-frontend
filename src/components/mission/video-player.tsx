'use client'

import { useRef, useEffect, useState } from 'react'
import YouTube, { YouTubeEvent } from 'react-youtube'
import { toast } from 'sonner'

interface VideoPlayerProps {
  videoId: string
  durationSeconds: number
  initialProgress: number
  onProgressUpdate: (currentTime: number) => void
  onComplete: () => void
}

const PROGRESS_UPDATE_INTERVAL_MS = 10000 // Update progress every 10 seconds

export function VideoPlayer({
  videoId,
  durationSeconds,
  initialProgress,
  onProgressUpdate,
  onComplete,
}: VideoPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const completedRef = useRef(false)
  const playerRef = useRef<YouTubeEvent['target'] | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const opts = {
    height: '480',
    width: '854',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0, // Don't show related videos
    },
  }

  // Save current playback time if valid
  const saveCurrentProgress = () => {
    const currentTime = playerRef.current?.getCurrentTime()
    if (!currentTime || currentTime <= 0) return

    onProgressUpdate(Math.floor(currentTime))
  }

  // Start progress tracking interval
  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current) // 防止重複啟動
    }

    progressIntervalRef.current = setInterval(
      saveCurrentProgress,
      PROGRESS_UPDATE_INTERVAL_MS
    )
  }

  // Stop progress tracking interval
  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }

  // Save progress before page unload
  useEffect(() => {
    window.addEventListener('beforeunload', saveCurrentProgress)
    return () => {
      window.removeEventListener('beforeunload', saveCurrentProgress)
      stopProgressTracking()
    }
  }, [onProgressUpdate])

  const handleReady = (event: YouTubeEvent) => {
    playerRef.current = event.target
    event.target.seekTo(initialProgress, true)
  }

  const handlePlay = () => {
    startProgressTracking()
  }

  const handlePause = () => {
    stopProgressTracking()
    saveCurrentProgress()
  }

  const handleVideoEnd = async () => {
    stopProgressTracking()

    // Prevent duplicate completion calls
    if (completedRef.current) return

    completedRef.current = true
    setIsCompleted(true)

    try {
      // Update progress to duration (100% completion)
      onProgressUpdate(durationSeconds)
      // Call completion handler
      onComplete()
    } catch (error) {
      console.error('Failed to mark mission as completed:', error)
    }
  }

  const handleError = (event: { data: number }) => {
    const errorMessages: Record<number, string> = {
      2: '影片連結無效',
      100: '影片不存在或已被移除',
      101: '此影片無法嵌入播放',
      150: '此影片無法嵌入播放',
    }

    const message = errorMessages[event.data] || '影片載入失敗，請稍後再試'
    toast.error(message)
  }

  return (
    <div className="video-player-wrapper w-full">
      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-lg bg-black">
        <div className="relative pb-[56.25%]">
          <div className="absolute inset-0">
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={handleReady}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnd={handleVideoEnd}
              onError={handleError}
              className="absolute inset-0 h-full w-full"
              iframeClassName="w-full h-full"
            />
          </div>
        </div>
      </div>
      {isCompleted && (
        <div className="mt-4 rounded-lg bg-green-900/30 p-4 text-center text-green-400">
          ✓ 影片已完成
        </div>
      )}
    </div>
  )
}
