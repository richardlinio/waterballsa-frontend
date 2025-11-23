import { Skeleton } from '@/components/ui/skeleton'

export function MissionLoadingSkeleton() {
  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      <div className="mx-auto max-w-5xl">
        <Skeleton className="mb-4 h-10 w-3/4" />
        <Skeleton className="mb-8 h-6 w-1/2" />
        <Skeleton className="mb-8 h-[480px] w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}
