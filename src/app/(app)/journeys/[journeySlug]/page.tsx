'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Globe, Smartphone, Award, Video, Target } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { JourneyChapterList } from '@/components/journey-chapter-list'
import { useJourney } from '@/contexts/journey-context'
import { useAuth } from '@/contexts/auth-context'

export default function JourneyPage() {
  const params = useParams()
  const router = useRouter()
  const journeySlug = params.journeySlug as string
  const { journey, isLoading, error, fetchJourney, userStatus } = useJourney()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (journeySlug && (!journey || journey.slug !== journeySlug)) {
      fetchJourney(journeySlug, user?.id)
    }
  }, [journeySlug, journey, fetchJourney, user?.id])

  if (isLoading) {
    return <JourneyLoadingSkeleton />
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
        <div className="text-center text-red-400">
          {error || 'Journey not found'}
        </div>
      </div>
    )
  }

  // Count total videos and missions
  const totalVideos = journey.chapters.reduce(
    (acc, chapter) =>
      acc + chapter.missions.filter(m => m.type === 'VIDEO').length,
    0
  )

  // Handle purchase button click
  const handlePurchaseClick = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      router.push(`/login?redirect=/journeys/${journeySlug}/orders`)
      return
    }

    // Check if user already has unpaid order
    if (userStatus?.hasUnpaidOrder && userStatus.unpaidOrderId) {
      // Redirect to existing unpaid order payment page
      router.push(`/journeys/${journeySlug}/orders/${userStatus.unpaidOrderId}`)
      return
    }

    // Check if user already purchased
    if (userStatus?.hasPurchased) {
      toast.success('您已經購買此課程')
      return
    }

    // Create new order
    router.push(`/journeys/${journeySlug}/orders`)
  }

  // Get button text based on user status
  const getButtonText = () => {
    if (!isAuthenticated) {
      return '立即購買'
    }
    if (userStatus?.hasPurchased) {
      return '開始學習'
    }
    if (userStatus?.hasUnpaidOrder) {
      return '前往付款'
    }
    return '立即購買'
  }

  const buttonText = getButtonText()

  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 px-8 py-12">
          <div className="mx-auto max-w-4xl">
            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold text-foreground">
              {journey.title}
            </h1>

            {/* Description */}
            <div className="mb-8 space-y-4 text-muted-foreground">
              <p>{journey.description}</p>
            </div>

            {/* Course Meta */}
            <div className="mb-6 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                {totalVideos} 部影片
              </span>
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                大量實戰題
              </span>
            </div>

            {/* Join Button (Mobile) */}
            <Button
              onClick={handlePurchaseClick}
              className="mb-8 w-full rounded-lg bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 lg:hidden"
            >
              {buttonText}
            </Button>

            {/* Chapters */}
            <JourneyChapterList
              chapters={journey.chapters}
              journeySlug={journeySlug}
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden w-80 shrink-0 border-l border-border px-6 py-12 lg:block">
          <div className="sticky top-24 space-y-6">
            {/* Join Button */}
            <Button
              onClick={handlePurchaseClick}
              className="w-full rounded-lg bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {buttonText}
            </Button>

            {/* Course Features */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Globe className="h-5 w-5" />
                <span>中文課程</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Smartphone className="h-5 w-5" />
                <span>支援行動裝置</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Award className="h-5 w-5" />
                <span>專業的完課認證</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function JourneyLoadingSkeleton() {
  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background">
      <div className="flex">
        <div className="flex-1 px-8 py-12">
          <div className="mx-auto max-w-4xl space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-6 w-48" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
        <aside className="hidden w-80 shrink-0 border-l border-border px-6 py-12 lg:block">
          <div className="space-y-6">
            <Skeleton className="h-14 w-full" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
