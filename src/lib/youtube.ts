/**
 * Extract YouTube video ID from various URL formats
 * @param url - YouTube URL or video ID
 * @returns Video ID string, or empty string if invalid
 */
export function extractYouTubeId(url: string | undefined): string {
  if (!url) return ''

  // If it's already just the ID
  if (!url.includes('/') && !url.includes('http')) {
    return url
  }

  // Extract from various YouTube URL formats
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) {
      return match[1]
    }
  }

  // If no pattern matches, assume it's an ID
  return url
}
