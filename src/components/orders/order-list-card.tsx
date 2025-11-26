import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { OrderSummary } from '@/lib/api/api-schema/order'

interface OrderListCardProps {
  order: OrderSummary
  onClick: () => void
}

export function OrderListCard({ order, onClick }: OrderListCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false,
    })
  }

  const getStatusBadge = () => {
    if (order.status === 'PAID') {
      return (
        <Badge variant="default" className="bg-green-600 text-white">
          已付款
        </Badge>
      )
    }
    if (order.status === 'EXPIRED') {
      return (
        <Badge variant="destructive" className="bg-red-600 text-white">
          已取消
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-yellow-600 text-white">
        未付款
      </Badge>
    )
  }

  const getNotes = () => {
    if (order.status === 'PAID') {
      return '付款完成'
    }
    if (order.status === 'EXPIRED') {
      return '期限内未完成付款'
    }
    if (order.status === 'UNPAID') {
      if (!order.expiredAt) return ''
      const deadline = order.expiredAt
      const now = Date.now()
      const daysLeft = Math.ceil((deadline - now) / (24 * 60 * 60 * 1000))
      if (daysLeft > 0) {
        return `請於 ${daysLeft} 天內完成付款`
      }
      return '即將過期'
    }
    return ''
  }

  // Get the first course name for display
  const courseName = order.items[0]?.journeyTitle || '未知課程'

  return (
    <Card
      className="cursor-pointer transition-all hover:scale-[1.02] hover:border-primary"
      onClick={onClick}
    >
      <div className="p-6">
        {/* Metadata section - single column layout */}
        <div className="mb-4 space-y-3">
          <div>
            <div className="mb-1 text-sm text-muted-foreground">訂單編號</div>
            <div className="font-mono font-semibold">{order.orderNumber}</div>
          </div>
          <div>
            <div className="mb-1 text-sm text-muted-foreground">付款日期</div>
            <div className="font-semibold">
              {order.paidAt ? formatDate(order.paidAt) : ''}
            </div>
          </div>
          <div>
            <div className="mb-1 text-sm text-muted-foreground">課程名稱</div>
            <div className="font-semibold">{courseName}</div>
          </div>
        </div>

        {/* Price section */}
        <div className="mb-4">
          <div className="mb-1 text-sm text-muted-foreground">金額</div>
          <div className="text-2xl font-bold">
            NT$ {order.price.toLocaleString()}
          </div>
        </div>

        {/* Notes section with status badge */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-1 text-sm text-muted-foreground">備註</div>
            <div className="text-sm">{getNotes()}</div>
          </div>
          <div className="ml-4">{getStatusBadge()}</div>
        </div>
      </div>
    </Card>
  )
}
