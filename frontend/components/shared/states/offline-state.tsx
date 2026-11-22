import { WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function OfflineState({
  title = 'اتصال اینترنت برقرار نیست',
  description = 'اتصال خود را بررسی کنید. پس از برقراری ارتباط می‌توانید دوباره تلاش کنید.',
  className,
}: OfflineStateProps) {
  return (
    <div role="status" className={cn('flex items-center gap-3 rounded-lg border bg-muted/30 p-4', className)}>
      <WifiOff aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
