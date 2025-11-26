'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useJourney } from '@/contexts/journey-context'
import { orderApi } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { OrderStepProgress } from '@/components/orders/order-step-indicator'
import { JourneyChapterList } from '@/components/journey-chapter-list'
import { ChevronLeft, Video, FileText } from 'lucide-react'
import Link from 'next/link'

export default function OrderCreationPage() {
  const params = useParams()
  const router = useRouter()
  const journeySlug = params.journeySlug as string
  const { isAuthenticated, user } = useAuth()
  const { journey, fetchJourney, userStatus, isLoading } = useJourney()
  const [isCreating, setIsCreating] = useState(false)
  const orderCreationAttempted = useRef(false)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(`/login?redirect=/journeys/${journeySlug}/orders`)
      return
    }

    // Fetch journey if not loaded or different slug
    if (!journey || journey.slug !== journeySlug) {
      fetchJourney(journeySlug, user?.id)
    }
  }, [isAuthenticated, journeySlug, journey, fetchJourney, user?.id, router])

  useEffect(() => {
    // Check user status once journey is loaded
    if (!journey || !isAuthenticated) return

    // Prevent double execution in React Strict Mode (development)
    if (orderCreationAttempted.current) return
    orderCreationAttempted.current = true

    // Check if user already has unpaid order - redirect to payment
    if (userStatus?.hasUnpaidOrder && userStatus.unpaidOrderId) {
      router.push(`/journeys/${journeySlug}/orders/${userStatus.unpaidOrderId}`)
      return
    }

    // Check if user already purchased - show toast and redirect
    if (userStatus?.hasPurchased) {
      toast.error('你已經購買此課程')
      router.push(`/journeys/${journeySlug}`)
      return
    }
  }, [journey, isAuthenticated, userStatus, journeySlug, router])

  const handleCreateOrder = async () => {
    if (!journey || isCreating) return

    setIsCreating(true)

    try {
      // Create new order
      const result = await orderApi.createOrder(journey.id)

      if (result.success) {
        // Redirect to payment page
        router.push(`/journeys/${journeySlug}/orders/${result.data.id}`)
      } else {
        // Handle errors
        if (result.error.status === 409) {
          // Already purchased
          toast.error('你已經購買此課程')
          router.push(`/journeys/${journeySlug}`)
        } else {
          toast.error(result.error.message || '建立訂單失敗，請稍後再試')
        }
      }
    } catch {
      toast.error('建立訂單時發生錯誤，請稍後再試')
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading || !journey) {
    return <OrderCreationPageSkeleton />
  }

  // Calculate course statistics
  const totalChapters = journey.chapters.length
  const totalMissions = journey.chapters.reduce(
    (total, chapter) => total + chapter.missions.length,
    0
  )
  const totalVideos = journey.chapters.reduce(
    (total, chapter) =>
      total +
      chapter.missions.filter(mission => mission.type === 'VIDEO').length,
    0
  )

  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Progress Steps */}
        <OrderStepProgress currentStep={1} />

        {/* Back Link */}
        <Link
          href={`/journeys/${journeySlug}`}
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          返回課程頁面
        </Link>

        {/* Course Title */}
        <h1 className="mb-4 text-3xl font-bold">{journey.title}</h1>

        {/* Course Description */}
        <p className="mb-6 text-muted-foreground">{journey.description}</p>

        {/* Course Stats */}
        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">教材保證</h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm">
                <span className="font-semibold">{totalChapters}</span> 大章節
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <span className="text-sm">
                <span className="font-semibold">{totalVideos}</span> 個單元
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm">
                <span className="font-semibold">{totalMissions}</span>{' '}
                道實戰題目
              </span>
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">課程內容</h2>
          <JourneyChapterList
            chapters={journey.chapters}
            journeySlug={journeySlug}
          />
        </div>

        {/* Create Order Button */}
        <div className="sticky bottom-0 border-t border-border bg-background/95 py-6 backdrop-blur supports-backdrop-filter:bg-background/60">
          <Button
            onClick={handleCreateOrder}
            disabled={isCreating}
            className="w-full rounded-lg py-6 text-lg font-semibold"
          >
            {isCreating ? '建立中...' : '建立訂單'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function OrderCreationPageSkeleton() {
  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}
