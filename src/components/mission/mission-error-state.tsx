'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface MissionErrorStateProps {
  error: string | null
}

export function MissionErrorState({ error }: MissionErrorStateProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-lg bg-red-900/30 p-6 text-center text-red-400">
          <h2 className="mb-2 text-xl font-bold">載入失敗</h2>
          <p>{error || '找不到課程內容'}</p>
          <Button
            onClick={() => router.push('/')}
            className="mt-4"
            variant="outline"
          >
            返回首頁
          </Button>
        </div>
      </div>
    </div>
  )
}
