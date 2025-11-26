/**
 * Order-related API types
 */

export type OrderStatus = 'UNPAID' | 'PAID'

export interface OrderItem {
  id: number
  journeyId: number
  journeyTitle: string
  journeySlug: string
  price: number
  quantity: number
}

export interface Order {
  id: number
  orderNumber: string
  userId: number
  username: string
  status: OrderStatus
  originalPrice: number
  discount: number
  price: number
  items: OrderItem[]
  createdAt: number // milliseconds timestamp
  paidAt: number | null // milliseconds timestamp
}

/**
 * Request body for creating an order
 */
export interface CreateOrderRequest {
  items: {
    journeyId: number
    quantity: number
  }[]
}

/**
 * Response for creating an order (201 Created or 200 OK for existing unpaid order)
 */
export type CreateOrderResponse = Order

/**
 * Response for getting order details
 */
export type GetOrderResponse = Order

/**
 * Response for completing payment
 */
export interface PayOrderResponse {
  id: number
  orderNumber: string
  status: 'PAID'
  price: number
  paidAt: number
  message: string
}
