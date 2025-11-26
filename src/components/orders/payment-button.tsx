'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { orderApi } from '@/lib/api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface PaymentButtonProps {
  orderId: string
  journeySlug: string
  onPaymentSuccess?: () => void
}

export function PaymentButton({
  orderId,
  journeySlug,
  onPaymentSuccess,
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      const result = await orderApi.payOrder(orderId)

      if (result.success) {
        toast.success('付款完成！')
        // Call optional callback
        onPaymentSuccess?.()
        // Redirect to success page
        router.push(`/journeys/${journeySlug}/orders/${orderId}/success`)
      } else {
        // Handle errors
        if (result.error.status === 409) {
          // Already paid
          toast.info('訂單已付款')
          router.push(`/journeys/${journeySlug}/orders/${orderId}/success`)
        } else if (result.error.status === 404) {
          // Order not found or no permission
          toast.error('找不到訂單或無權限')
          router.push(`/journeys/${journeySlug}`)
        } else if (result.error.status === 410 || result.error.status === 400) {
          // Order expired
          toast.error('訂單已過期，請重新建立訂單')
          router.push(`/journeys/${journeySlug}`)
        } else {
          toast.error(result.error.message || '付款失敗，請稍後再試')
        }
      }
    } catch {
      toast.error('付款時發生錯誤，請稍後再試')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isProcessing}
      className="w-full rounded-lg bg-primary py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          處理中...
        </>
      ) : (
        '進行支付'
      )}
    </Button>
  )
}
