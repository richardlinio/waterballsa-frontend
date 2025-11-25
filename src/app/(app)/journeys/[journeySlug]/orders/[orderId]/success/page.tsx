'use client'

import { useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useJourney } from '@/contexts/journey-context'
import { orderApi } from '@/lib/api'
import type { Order } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { OrderSummaryCard } from '@/components/orders/order-summary-card'
import { OrderStepProgress } from '@/components/orders/order-step-indicator'
import { CheckCircle2 } from 'lucide-react'
import useSWR from 'swr'

/**
 * Custom error type with status property
 */
interface OrderError extends Error {
  status?: number
}

/**
 * Fetcher function for SWR to get order data
 */
async function fetchOrder(orderId: string): Promise<Order> {
  const result = await orderApi.getOrderById(orderId)

  if (!result.success) {
    // Throw error to trigger SWR's error handling
    const error: OrderError = new Error(result.error.message || '載入訂單失敗')
    // Attach status for custom error handling
    error.status = result.error.status
    throw error
  }

  return result.data
}

export default function SuccessPage() {
  const params = useParams()
  const router = useRouter()
  const journeySlug = params.journeySlug as string
  const orderId = params.orderId as string
  const { isAuthenticated } = useAuth()
  const { journey, refreshJourneyStatus } = useJourney()
  const hasRefreshedStatus = useRef(false)

  // Use SWR for data fetching
  const {
    data: order,
    error,
    isLoading,
  } = useSWR<Order>(
    // Only fetch if authenticated
    isAuthenticated ? `/orders/${orderId}/success` : null,
    () => fetchOrder(orderId),
    {
      // Don't revalidate on focus for success page
      revalidateOnFocus: false,
      // Retry on error
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  )

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(
        `/login?redirect=/journeys/${journeySlug}/orders/${orderId}/success`
      )
    }
  }, [isAuthenticated, journeySlug, orderId, router])

  // Handle 404 error (redirect to journey page)
  useEffect(() => {
    if (error && (error as OrderError).status === 404) {
      toast.error('找不到訂單或無權限查看')
      router.push(`/journeys/${journeySlug}`)
    }
  }, [error, journeySlug, router])

  // Redirect if order is unpaid
  useEffect(() => {
    if (order?.status === 'UNPAID') {
      toast.info('訂單尚未付款')
      router.push(`/journeys/${journeySlug}/orders/${orderId}`)
    }
  }, [order?.status, journeySlug, orderId, router])

  // Refresh journey status once when order is confirmed as paid
  useEffect(() => {
    if (order?.status === 'PAID' && !hasRefreshedStatus.current) {
      hasRefreshedStatus.current = true
      refreshJourneyStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.status]) // Don't include refreshJourneyStatus to avoid unnecessary re-fetches

  const handleStartLearning = () => {
    // Redirect to the first mission of the journey
    if (journey && journey.chapters.length > 0) {
      const firstChapter = journey.chapters[0]
      if (firstChapter.missions.length > 0) {
        const firstMission = firstChapter.missions[0]
        router.push(
          `/journeys/${journeySlug}/chapters/${firstChapter.id}/missions/${firstMission.id}`
        )
        return
      }
    }
    // Fallback: redirect to journey page
    router.push(`/journeys/${journeySlug}`)
  }

  if (isLoading) {
    return <SuccessPageSkeleton />
  }

  if (error || !order) {
    return (
      <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
        <div className="mx-auto max-w-2xl text-center text-red-400">
          {error || '找不到訂單'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Progress Steps */}
        <OrderStepProgress currentStep={3} />

        {/* Success Message */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">購買完成！</h1>
          <p className="text-muted-foreground">
            恭喜你成功購買課程，現在可以開始學習了
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="mb-6">
          <OrderSummaryCard order={order} variant="completed" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleStartLearning}
            className="flex-1 rounded-lg bg-primary py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
          >
            立即上課
          </Button>
          <Button
            onClick={() => router.push(`/journeys/${journeySlug}`)}
            variant="outline"
            className="flex-1 rounded-lg py-6 text-lg font-semibold"
          >
            查看課程
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-950">
          <h2 className="mb-3 font-semibold text-blue-900 dark:text-blue-100">
            接下來該做什麼？
          </h2>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">•</span>
              <span>點擊「立即上課」按鈕開始第一個任務，跟著課程進度學習</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">•</span>
              <span>每週跟著學習進度完成任務，獲得經驗值和成就</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">•</span>
              <span>
                如有任何問題，歡迎聯繫客服{' '}
                <a
                  href="mailto:sales@waterballsa.tw"
                  className="text-primary hover:underline"
                >
                  sales@waterballsa.tw
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function SuccessPageSkeleton() {
  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  )
}
