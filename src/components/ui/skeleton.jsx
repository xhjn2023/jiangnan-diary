import { cn } from '../../lib/utils'

export function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-mini bg-ink/6', className)} {...props} />
}

export function DiarySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(function (i) {
        return (
          <div key={i} className="card rounded-entry p-4 border-l-4 border-l-green/30 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )
      })}
    </div>
  )
}
