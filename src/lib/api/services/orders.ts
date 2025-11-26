import { apiClient } from '../core/client'
import type {
  ApiResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  PayOrderResponse,
} from '@/lib/api/api-schema'

/**
 * Order API
 */
export const orderApi = {
  /**
   * Create a new order for a journey
   * @param journeyId - Journey ID to purchase
   * @param quantity - Quantity to purchase (optional, defaults to 1)
   * @returns Promise<ApiResponse<CreateOrderResponse>>
   *
   * @example
   * ```typescript
   * const result = await orderApi.createOrder(3)
   * if (result.success) {
   *   console.log('Order created:', result.data.orderNumber)
   *   // Navigate to payment page with result.data.id
   * } else {
   *   if (result.error.status === 409) {
   *     console.log('Already purchased or has unpaid order')
   *   }
   * }
   * ```
   */
  createOrder: async (
    journeyId: number,
    quantity: number = 1
  ): Promise<ApiResponse<CreateOrderResponse>> => {
    const requestBody: CreateOrderRequest = {
      items: [
        {
          journeyId,
          quantity,
        },
      ],
    }
    return apiClient.post<CreateOrderResponse>('/orders', requestBody)
  },

  /**
   * Get order details by order ID
   * @param orderId - Order ID (order number string)
   * @returns Promise<ApiResponse<GetOrderResponse>>
   *
   * @example
   * ```typescript
   * const result = await orderApi.getOrderById('20251121011117cd5')
   * if (result.success) {
   *   console.log('Order:', result.data)
   * } else {
   *   console.error('Failed to get order:', result.error.message)
   * }
   * ```
   */
  getOrderById: async (
    orderId: string
  ): Promise<ApiResponse<GetOrderResponse>> => {
    return apiClient.get<GetOrderResponse>(`/orders/${orderId}`)
  },

  /**
   * Complete payment for an order (simulated payment for MVP)
   * @param orderId - Order ID (order number string)
   * @returns Promise<ApiResponse<PayOrderResponse>>
   *
   * @example
   * ```typescript
   * const result = await orderApi.payOrder('20251121011117cd5')
   * if (result.success) {
   *   console.log('Payment completed:', result.data.message)
   *   // Navigate to success page
   * } else {
   *   if (result.error.status === 409) {
   *     console.log('Order already paid')
   *   }
   * }
   * ```
   */
  payOrder: async (orderId: string): Promise<ApiResponse<PayOrderResponse>> => {
    return apiClient.post<PayOrderResponse>(`/orders/${orderId}/action/pay`)
  },
}

export default orderApi
