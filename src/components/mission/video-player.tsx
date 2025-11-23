'use client'

import YouTube, { YouTubeEvent } from 'react-youtube'
import { toast } from 'sonner'

interface VideoPlayerProps {
  videoId: string
  isCompleted: boolean
  onReady: (event: YouTubeEvent) => void
  onPlay: () => void
  onPause: () => void
  onEnd: () => void
}

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

export function VideoPlayer({
  videoId,
  isCompleted,
  onReady,
  onPlay,
  onPause,
  onEnd,
}: VideoPlayerProps) {
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
              onReady={onReady}
              onPlay={onPlay}
              onPause={onPause}
              onEnd={onEnd}
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
