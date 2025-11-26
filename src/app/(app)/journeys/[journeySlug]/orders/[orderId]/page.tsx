'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { orderApi } from '@/lib/api'
import type { Order } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { OrderSummaryCard } from '@/components/orders/order-summary-card'
import { PaymentButton } from '@/components/orders/payment-button'
import { OrderStepProgress } from '@/components/orders/order-step-indicator'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
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

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const journeySlug = params.journeySlug as string
  const orderId = params.orderId as string
  const { isAuthenticated } = useAuth()

  // Use SWR for data fetching
  const {
    data: order,
    error,
    isLoading,
  } = useSWR<Order>(
    // Only fetch if authenticated
    isAuthenticated ? `/orders/${orderId}` : null,
    () => fetchOrder(orderId),
    {
      // Don't revalidate on focus for payment page
      revalidateOnFocus: false,
      // Retry on error
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  )

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/journeys/${journeySlug}/orders/${orderId}`)
    }
  }, [isAuthenticated, journeySlug, orderId, router])

  // Handle 404 error (redirect to journey page)
  useEffect(() => {
    if (error && (error as OrderError).status === 404) {
      toast.error('找不到訂單或無權限查看')
      router.push(`/journeys/${journeySlug}`)
    }
  }, [error, journeySlug, router])

  // Redirect if order is already paid
  useEffect(() => {
    if (order?.status === 'PAID') {
      router.push(`/journeys/${journeySlug}/orders/${orderId}/success`)
    }
  }, [order, journeySlug, orderId, router])

  if (isLoading) {
    return <PaymentPageSkeleton />
  }

  if (error || !order) {
    return (
      <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
        <div className="mx-auto max-w-2xl text-center text-red-400">
          {error?.message || '找不到訂單'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Progress Steps */}
        <OrderStepProgress currentStep={2} />

        {/* Back Link */}
        <Link
          href={`/journeys/${journeySlug}`}
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          返回課程頁面
        </Link>

        {/* Page Title */}
        <h1 className="mb-6 text-3xl font-bold">完成支付</h1>

        {/* Order Summary Card */}
        <div className="mb-6">
          <OrderSummaryCard order={order} variant="pending" />
        </div>

        {/* Payment Method Section */}
        <div className="mb-6 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">選取付款方式</h2>
          <div className="space-y-3">
            {/* ATM Payment Option */}
            <div className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-primary bg-primary/5 p-4">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
                <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="2"
                    y="6"
                    width="20"
                    height="12"
                    rx="2"
                    strokeWidth="2"
                  />
                  <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" />
                </svg>
                <span className="font-medium">ATM 匯款</span>
              </div>
            </div>

            {/* Credit Card Option (Disabled) */}
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4 opacity-50">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted-foreground"></div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="2"
                    y="5"
                    width="20"
                    height="14"
                    rx="2"
                    strokeWidth="2"
                  />
                  <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" />
                </svg>
                <span className="font-medium">信用卡（一次付清）</span>
              </div>
            </div>

            {/* Installment Option (Disabled) */}
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4 opacity-50">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted-foreground"></div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M2 12h20M12 2v20"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-medium">組合零卡分期</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Info (Optional) */}
        <div className="mb-6">
          <details className="rounded-lg border border-border bg-card">
            <summary className="cursor-pointer p-4 font-semibold">
              發票資訊（選填）
            </summary>
            <div className="border-t border-border p-4 text-sm text-muted-foreground">
              若您需要發票，請於付款完成後聯繫客服提供相關資訊。
            </div>
          </details>
        </div>

        {/* Payment Button */}
        <PaymentButton orderId={orderId} journeySlug={journeySlug} />

        {/* Footer Note */}
        <div className="mt-6 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          <p className="mb-2">
            付款成功後的平日一天內，系統會自動幫您開通此帳號的正式使用資格，您即可開始享受學習旅程。如過系統錯誤則會在一日內請聯絡客服（
            <a
              href="mailto:sales@waterballsa.tw"
              className="text-primary hover:underline"
            >
              sales@waterballsa.tw
            </a>
            ），客服在平日會在一日內幫您確認並確認是否已開通。
          </p>
          <p>
            若您有其他購買相關的問題，歡迎寄信至{' '}
            <a
              href="mailto:sales@waterballsa.tw"
              className="text-primary hover:underline"
            >
              sales@waterballsa.tw
            </a>{' '}
            詢問。
          </p>
        </div>

        {/* Service Agreement */}
        <div className="mt-6">
          <details className="rounded-lg border border-border bg-card">
            <summary className="cursor-pointer p-4 font-semibold">
              AI x BDD 課程服務契約
            </summary>
            <div className="border-t border-border p-4 text-sm text-muted-foreground">
              <p className="mb-2">
                本網際網路課程購買服務契約（以下簡稱本契約），指水球球軟體服務有限公司（以下簡稱「水球球」、「我們」、「我們的」，公司基本資料詳如下）授權您於
                waterballsa.tw
                網域之網站或水球球所有之移動裝置平台（以下合稱本平台），使用水球球透過網際網路、或移動裝置平台離線收聽之教學、評量或其他相關服務(以下簡稱「本服務」)。愛此，關於本服務之權利義務，雙方同意以本契約之約定之。
              </p>
              <h3 className="mb-1 mt-4 font-semibold text-foreground">
                1. 契約審閱期間及當事人基本資料
              </h3>
              <p className="mb-2 text-xs">
                本契約公司基本資料：水球球軟體服務有限公司（統編：90451193）
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

function PaymentPageSkeleton() {
  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  )
}
