import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CardSkeletonProps {
  className?: string;
  withMedia?: boolean;
}

export function CardSkeleton({ className, withMedia = false }: CardSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="در حال بارگذاری کارت"
      className={cn('rounded-xl border bg-card p-4', className)}
    >
      {withMedia ? <Skeleton className="mb-4 aspect-video w-full rounded-lg" /> : null}
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
