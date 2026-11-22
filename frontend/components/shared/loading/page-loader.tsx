import { Spinner, type SpinnerProps } from './spinner';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  label?: string;
  className?: string;
  spinnerSize?: SpinnerProps['size'];
  fullScreen?: boolean;
}

export function PageLoader({
  label = 'در حال بارگذاری صفحه',
  className,
  spinnerSize = 'lg',
  fullScreen = true,
}: PageLoaderProps) {
  return (
    <div
      aria-busy="true"
      className={cn(
        'flex w-full flex-col items-center justify-center gap-3',
        fullScreen ? 'min-h-[60svh]' : 'min-h-40',
        className,
      )}
    >
      <Spinner size={spinnerSize} label={label} />
      <p aria-hidden="true" className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
