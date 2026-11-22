import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ListSkeletonProps {
  rows?: number;
  className?: string;
  showAvatar?: boolean;
}

export function ListSkeleton({
  rows = 5,
  className,
  showAvatar = true,
}: ListSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="در حال بارگذاری فهرست"
      className={cn('divide-y rounded-lg border', className)}
    >
      {Array.from({ length: Math.max(1, rows) }, (_, index) => (
        <div className="flex items-center gap-3 p-3" key={index}>
          {showAvatar ? <Skeleton className="size-9 shrink-0 rounded-full" /> : null}
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
          <Skeleton className="h-8 w-16 shrink-0" />
        </div>
      ))}
    </div>
  );
}
