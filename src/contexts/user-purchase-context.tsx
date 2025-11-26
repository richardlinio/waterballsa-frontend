'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { userPurchaseApi } from '@/lib/api'
import type { OrderSummary } from '@/lib/api'

interface UserPurchaseContextType {
  // Purchased journeys as Set for O(1) lookup
  purchasedJourneyIds: Set<number>
  // Unpaid orders
  unpaidOrders: OrderSummary[]
  // Loading states
  isLoading: boolean
  isRefreshing: boolean
  // Helper methods
  hasPurchased: (journeyId: number) => boolean
  getUnpaidOrderForJourney: (journeyId: number) => OrderSummary | null
  // Refresh methods
  refreshPurchases: () => Promise<void>
  invalidateAndRefresh: () => Promise<void>
}

const UserPurchaseContext = createContext<UserPurchaseContextType | undefined>(
  undefined
)

interface UserPurchaseProviderProps {
  children: ReactNode
}

export function UserPurchaseProvider({ children }: UserPurchaseProviderProps) {
  const { user, isAuthenticated } = useAuth()

  const [purchasedJourneyIds, setPurchasedJourneyIds] = useState<Set<number>>(
    new Set()
  )
  const [unpaidOrders, setUnpaidOrders] = useState<OrderSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  /**
   * Fetch user's purchased journeys and unpaid orders
   * Called on login and after successful purchase
   */
  const fetchUserPurchaseData = useCallback(
    async (showLoading = true) => {
      if (!user || !isAuthenticated) {
        // Clear data if not authenticated
        setPurchasedJourneyIds(new Set())
        setUnpaidOrders([])
        return
      }

      try {
        if (showLoading) {
          setIsLoading(true)
        } else {
          setIsRefreshing(true)
        }

        const userId = parseInt(user.id)

        // Fetch in parallel for better performance
        const [purchasesResult, ordersResult] = await Promise.all([
          userPurchaseApi.getUserPurchasedJourneys(userId),
          userPurchaseApi.getUserOrders(userId, {
            page: 1,
            limit: 50, // Fetch more to catch all unpaid orders
            status: 'UNPAID',
          }),
        ])

        // Process purchased journeys into Set for O(1) lookup
        if (purchasesResult.success) {
          const journeyIdsSet = new Set(
            purchasesResult.data.journeys.map(j => j.journeyId)
          )
          setPurchasedJourneyIds(journeyIdsSet)
        } else if (showLoading) {
          // Only show toast on initial load failure
          toast.error('無法載入已購買課程，請重新整理頁面')
        }

        // Store unpaid orders
        if (ordersResult.success) {
          const unpaid = ordersResult.data.orders.filter(
            order => order.status === 'UNPAID'
          )
          setUnpaidOrders(unpaid)
        }
      } catch (error) {
        console.error(
          'Failed to fetch user purchase data:',
          error instanceof Error ? error.message : String(error)
        )
        // Keep stale data - don't clear existing state
        if (showLoading) {
          toast.error('載入購買資訊失敗，請檢查網路連線')
        }
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [user, isAuthenticated]
  )

  /**
   * Check if user has purchased a specific journey
   */
  const hasPurchased = useCallback(
    (journeyId: number): boolean => {
      return purchasedJourneyIds.has(journeyId)
    },
    [purchasedJourneyIds]
  )

  /**
   * Get unpaid order for a specific journey (if exists)
   */
  const getUnpaidOrderForJourney = useCallback(
    (journeyId: number): OrderSummary | null => {
      return (
        unpaidOrders.find(order =>
          order.items.some(item => item.journeyId === journeyId)
        ) || null
      )
    },
    [unpaidOrders]
  )

  /**
   * Refresh purchase data (background, no loading state)
   */
  const refreshPurchases = useCallback(async () => {
    await fetchUserPurchaseData(false)
  }, [fetchUserPurchaseData])

  /**
   * Invalidate and refresh (used after successful purchase)
   * Shows loading state and broadcasts to other tabs
   */
  const invalidateAndRefresh = useCallback(async () => {
    await fetchUserPurchaseData(true)

    // Notify other tabs
    localStorage.setItem('purchase_updated', Date.now().toString())
    localStorage.removeItem('purchase_updated')
  }, [fetchUserPurchaseData])

  /**
   * Initial fetch on login
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserPurchaseData(true)
    } else {
      // Clear data on logout
      setPurchasedJourneyIds(new Set())
      setUnpaidOrders([])
    }
  }, [isAuthenticated, user, fetchUserPurchaseData])

  /**
   * Cross-tab sync: Listen for purchase updates from other tabs
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'purchase_updated' && e.newValue) {
        // Another tab completed a purchase
        refreshPurchases()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [refreshPurchases])

  const value: UserPurchaseContextType = {
    purchasedJourneyIds,
    unpaidOrders,
    isLoading,
    isRefreshing,
    hasPurchased,
    getUnpaidOrderForJourney,
    refreshPurchases,
    invalidateAndRefresh,
  }

  return (
    <UserPurchaseContext.Provider value={value}>
      {children}
    </UserPurchaseContext.Provider>
  )
}

export function useUserPurchase() {
  const context = useContext(UserPurchaseContext)
  if (context === undefined) {
    throw new Error(
      'useUserPurchase must be used within a UserPurchaseProvider'
    )
  }
  return context
}
