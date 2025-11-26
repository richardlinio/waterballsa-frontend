/**
 * User purchase-related API types
 */

import type { OrderSummary } from './order'

/**
 * Purchased journey item from GET /users/{userId}/journeys
 */
export interface PurchasedJourney {
  journeyId: number
  journeyTitle: string
  journeySlug: string
  coverImageUrl: string
  teacherName: string
  purchasedAt: number // milliseconds timestamp
  orderNumber: string
}

/**
 * Response for getting user's purchased journeys
 */
export interface UserPurchasedJourneysResponse {
  journeys: PurchasedJourney[]
}

/**
 * Pagination metadata
 */
export interface Pagination {
  page: number
  limit: number
  total: number
}

/**
 * Response for getting user's orders with pagination
 */
export interface UserOrdersResponse {
  orders: OrderSummary[]
  pagination: Pagination
}

/**
 * Query parameters for getUserOrders
 */
export interface GetUserOrdersParams {
  page?: number
  limit?: number
  status?: 'UNPAID' | 'PAID' | 'EXPIRED'
}
