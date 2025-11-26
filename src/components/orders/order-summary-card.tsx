import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Order } from '@/lib/api'

interface OrderSummaryCardProps {
  order: Order
  variant?: 'pending' | 'completed'
}

export function OrderSummaryCard({
  order,
  variant = 'pending',
}: OrderSummaryCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
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
          已過期
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-yellow-600 text-white">
        未付款
      </Badge>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">訂單資訊</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Number */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">訂單編號：</span>
          <span className="font-mono font-semibold">{order.orderNumber}</span>
        </div>

        {/* Payment Deadline - only show for unpaid orders */}
        {variant === 'pending' && order.status === 'UNPAID' && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">付款截止時間：</span>
            <span className="font-semibold text-red-600">
              {formatDate(order.createdAt + 3 * 24 * 60 * 60 * 1000)}
            </span>
          </div>
        )}
        {variant === 'pending' && order.status === 'EXPIRED' && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">已於以下時間過期：</span>
            <span className="font-semibold text-red-600">
              {formatDate(order.createdAt + 3 * 24 * 60 * 60 * 1000)}
            </span>
          </div>
        )}

        <Separator />

        {/* Payment Instructions */}
        {variant === 'pending' && order.status === 'UNPAID' && (
          <>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
              <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                付款說明
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                訂單已建立完成，請你於三日內付款。
              </p>
            </div>
            <Separator />
          </>
        )}

        {/* Expired Order Notice */}
        {variant === 'pending' && order.status === 'EXPIRED' && (
          <>
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
              <h3 className="mb-2 font-semibold text-red-900 dark:text-red-100">
                訂單已過期
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200">
                此訂單已超過付款期限（三天），無法繼續付款。請返回課程頁面重新建立訂單。
              </p>
            </div>
            <Separator />
          </>
        )}

        {/* Course Items */}
        <div>
          <h3 className="mb-3 font-semibold">課程內容</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-start justify-between rounded-lg border border-border p-3"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{item.journeyTitle}</h4>
                  <p className="text-sm text-muted-foreground">
                    數量：{item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    NT$ {item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Order Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">原價</span>
            <span>NT$ {order.originalPrice.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>折扣</span>
              <span>- NT$ {order.discount.toLocaleString()}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>總金額</span>
            <span className="text-primary">
              NT$ {order.price.toLocaleString()}
            </span>
          </div>
        </div>

        <Separator />

        {/* Order Metadata */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>訂單建立時間：</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          {order.paidAt && (
            <div className="flex justify-between">
              <span>付款時間：</span>
              <span className="text-green-600">{formatDate(order.paidAt)}</span>
            </div>
          )}
        </div>

        {/* Additional info for completed orders */}
        {variant === 'completed' && order.status === 'PAID' && (
          <>
            <Separator />
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
              <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                付款完成
              </p>
              <p className="mt-1 text-xs text-green-800 dark:text-green-200">
                付款成功後的平日一天內，系統會自動幫您開通此帳號的正式使用資格，您即可開始享受學習旅程。如過系統錯誤則會在一日內請聯絡客服（sales@waterballsa.tw），客服在平日會在一日內幫您確認並確認是否已開通。
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
