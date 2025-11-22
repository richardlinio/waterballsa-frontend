'use client'

import { useRef, useEffect, useState } from 'react'
import YouTube, { YouTubeEvent } from 'react-youtube'

interface VideoPlayerProps {
  videoId: string
  durationSeconds: number
  initialProgress: number
  onProgressUpdate: (currentTime: number) => void
  onComplete: () => void
}

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

  // Start progress tracking interval
  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current) // 防止重複啟動
    }

    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime()
        if (currentTime > 0) {
          onProgressUpdate(Math.floor(currentTime)) // 無條件捨去小數
        }
      }
    }, 10000) // Every 10 seconds
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
    const handleBeforeUnload = () => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime()
        if (currentTime > 0) {
          onProgressUpdate(Math.floor(currentTime))
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
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

  const handleVideoEnd = async () => {
    console.log('Video ended')
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
      console.log('Mission completed')
    } catch (error) {
      console.error('Failed to mark mission as completed:', error)
    }
  }

  const handleError = (event: { data: number }) => {
    const errorMessages: Record<number, string> = {
      2: 'Invalid video ID',
      100: 'Video not found or removed',
      101: 'Video cannot be embedded',
      150: 'Video cannot be embedded',
    }

    const message = errorMessages[event.data] || 'Unknown error'
    console.error('YouTube player error:', message)
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
