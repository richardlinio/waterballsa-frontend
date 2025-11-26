import { Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function OrderEmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <Receipt className="h-16 w-16 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">您還沒有任何訂單</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        開始探索課程，創建您的第一筆訂單！
      </p>
      <Button asChild className="mt-6">
        <Link href="/">瀏覽課程</Link>
      </Button>
    </div>
  )
}
