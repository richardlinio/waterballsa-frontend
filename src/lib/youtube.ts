/**
 * Extract YouTube video ID from various URL formats
 * @param url - YouTube URL or video ID
 * @returns Video ID string
 */
export function extractYouTubeId(url: string): string {
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
