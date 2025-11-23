'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import type { YouTubeEvent } from 'react-youtube'

interface UseVideoProgressOptions {
  initialProgress: number
  durationSeconds: number
  onProgressUpdate: (currentTime: number) => void
  onComplete: () => void
}

interface UseVideoProgressReturn {
  isCompleted: boolean
  playerHandlers: {
    onReady: (event: YouTubeEvent) => void
    onPlay: () => void
    onPause: () => void
    onEnd: () => void
  }
}

const PROGRESS_UPDATE_INTERVAL_MS = 10000 // Update progress every 10 seconds

export function useVideoProgress({
  initialProgress,
  durationSeconds,
  onProgressUpdate,
  onComplete,
}: UseVideoProgressOptions): UseVideoProgressReturn {
  const [isCompleted, setIsCompleted] = useState(false)
  const completedRef = useRef(false)
  const playerRef = useRef<YouTubeEvent['target'] | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Save current playback time if valid
  const saveCurrentProgress = useCallback(() => {
    const currentTime = playerRef.current?.getCurrentTime()
    if (!currentTime || currentTime <= 0) return

    onProgressUpdate(Math.floor(currentTime))
  }, [onProgressUpdate])

  // Start progress tracking interval
  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    progressIntervalRef.current = setInterval(
      saveCurrentProgress,
      PROGRESS_UPDATE_INTERVAL_MS
    )
  }, [saveCurrentProgress])

  // Stop progress tracking interval
  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }, [])

  // Save progress before page unload
  useEffect(() => {
    window.addEventListener('beforeunload', saveCurrentProgress)
    return () => {
      window.removeEventListener('beforeunload', saveCurrentProgress)
      stopProgressTracking()
    }
  }, [saveCurrentProgress, stopProgressTracking])

  const handleReady = useCallback(
    (event: YouTubeEvent) => {
      playerRef.current = event.target
      event.target.seekTo(initialProgress, true)
    },
    [initialProgress]
  )

  const handlePlay = useCallback(() => {
    startProgressTracking()
  }, [startProgressTracking])

  const handlePause = useCallback(() => {
    stopProgressTracking()
    saveCurrentProgress()
  }, [stopProgressTracking, saveCurrentProgress])

  const handleEnd = useCallback(() => {
    stopProgressTracking()

    // Prevent duplicate completion calls
    if (completedRef.current) return

    completedRef.current = true
    setIsCompleted(true)

    // Update progress to duration (100% completion)
    onProgressUpdate(durationSeconds)
    // Call completion handler
    onComplete()
  }, [stopProgressTracking, durationSeconds, onProgressUpdate, onComplete])

  return {
    isCompleted,
    playerHandlers: {
      onReady: handleReady,
      onPlay: handlePlay,
      onPause: handlePause,
      onEnd: handleEnd,
    },
  }
}
