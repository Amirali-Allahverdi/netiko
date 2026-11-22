import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ContentSkeletonProps {
  className?: string;
  lines?: number;
  withAvatar?: boolean;
}

export function ContentSkeleton({
  className,
  lines = 3,
  withAvatar = false,
}: ContentSkeletonProps) {
  return (
    <div
      aria-label="در حال بارگذاری محتوا"
      aria-busy="true"
      className={cn('w-full space-y-3', className)}
    >
      {withAvatar ? (
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ) : null}
      {Array.from({ length: Math.max(1, lines) }, (_, index) => (
        <Skeleton
          key={index}
          className={cn('h-4', index === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}
