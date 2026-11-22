import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
  showHeader?: boolean;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
  showHeader = true,
}: TableSkeletonProps) {
  const safeRows = Math.max(1, rows);
  const safeColumns = Math.max(1, columns);

  return (
    <div
      aria-busy="true"
      aria-label="در حال بارگذاری جدول"
      className={cn('w-full overflow-hidden rounded-lg border', className)}
    >
      {showHeader ? (
        <div
          className="grid gap-4 border-b bg-muted/40 px-4 py-3"
          style={{ gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: safeColumns }, (_, index) => (
            <Skeleton className="h-4 w-3/4" key={index} />
          ))}
        </div>
      ) : null}
      {Array.from({ length: safeRows }, (_, row) => (
        <div
          className="grid gap-4 border-b px-4 py-4 last:border-b-0"
          style={{ gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))` }}
          key={row}
        >
          {Array.from({ length: safeColumns }, (_, column) => (
            <Skeleton
              className={cn('h-4', column === 0 ? 'w-4/5' : 'w-3/5')}
              key={column}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
