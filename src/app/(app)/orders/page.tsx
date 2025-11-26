'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useUserPurchase } from '@/contexts/user-purchase-context'
import { userPurchaseApi, journeyApi } from '@/lib/api'
import useSWR from 'swr'
import { Receipt } from 'lucide-react'
import { OrderListCard } from '@/components/orders/order-list-card'
import { OrderEmptyState } from '@/components/orders/order-empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { OrderSummary } from '@/lib/api/api-schema/order'
import type { UserOrdersResponse } from '@/lib/api/api-schema/user-purchase'

/**
 * Fetcher function for SWR to get user orders
 */
async function fetchUserOrders(
  userId: number,
  page: number,
  limit: number
): Promise<UserOrdersResponse> {
  const result = await userPurchaseApi.getUserOrders(userId, { page, limit })

  if (!result.success) {
    const error = new Error(result.error.message || '載入訂單失敗')
    throw error
  }

  return result.data
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { isRefreshing } = useUserPurchase()

  // TODO: Pagination not implemented yet
  // Future enhancement: Add pagination controls when needed
  const page = 1
  const limit = 20 // Show first 20 orders

  // Use SWR for data fetching
  const {
    data: ordersResponse,
    error,
    isLoading,
    mutate,
  } = useSWR<UserOrdersResponse>(
    // Only fetch if authenticated and user exists
    isAuthenticated && user
      ? `/users/${user.id}/orders?page=${page}&limit=${limit}`
      : null,
    () => fetchUserOrders(Number(user!.id), page, limit),
    {
      // Don't revalidate on focus for order list
      revalidateOnFocus: false,
      // Retry on error
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  )

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders')
    }
  }, [authLoading, isAuthenticated, router])

  // Sync with UserPurchaseContext - refresh orders when purchase status changes
  useEffect(() => {
    if (isRefreshing) {
      mutate()
    }
  }, [isRefreshing, mutate])

  // Handle order click - navigate to payment page
  const handleOrderClick = async (order: OrderSummary) => {
    try {
      // Get journey slug from journey list API
      const firstItem = order.items[0]
      if (!firstItem) {
        toast.error('訂單資訊不完整')
        return
      }

      const journeyListResult = await journeyApi.getJourneyList()

      if (journeyListResult.success) {
        const journey = journeyListResult.data.journeys.find(
          j => j.id === firstItem.journeyId
        )

        if (journey) {
          router.push(`/journeys/${journey.slug}/orders/${order.id}`)
        } else {
          toast.error('無法找到課程資訊')
        }
      } else {
        toast.error('載入課程資訊失敗')
      }
    } catch {
      toast.error('發生錯誤，請稍後再試')
    }
  }

  // Loading state
  if (isLoading) {
    return <OrderListSkeleton />
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-red-400">載入訂單失敗</p>
          <Button onClick={() => mutate()} className="mt-4">
            重試
          </Button>
        </div>
      </div>
    )
  }

  // Extract orders from response
  const orders = ordersResponse?.orders || []

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <Receipt className="h-8 w-8" />
            <h1 className="text-3xl font-bold">訂單紀錄</h1>
          </div>
          <OrderEmptyState />
        </div>
      </div>
    )
  }

  // Main content with orders
  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Receipt className="h-8 w-8" />
          <h1 className="text-3xl font-bold">訂單紀錄</h1>
        </div>

        {/* Order Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order: OrderSummary) => (
            <OrderListCard
              key={order.id}
              order={order}
              onClick={() => handleOrderClick(order)}
            />
          ))}
        </div>

        {/* Pagination info (for future implementation) */}
        {ordersResponse?.pagination && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            顯示 {orders.length} 筆訂單，共 {ordersResponse.pagination.total} 筆
          </div>
        )}
      </div>
    </div>
  )
}

function OrderListSkeleton() {
  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      <div className="mx-auto max-w-6xl">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
