import { cn } from '@/lib/utils';

export interface SpinnerProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeClasses = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
} satisfies Record<NonNullable<SpinnerProps['size']>, string>;

export function Spinner({
  className,
  size = 'md',
  label = 'در حال بارگذاری',
}: SpinnerProps) {
  return (
    <span
      aria-label={label}
      role="status"
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none',
        sizeClasses[size],
        className,
      )}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}
