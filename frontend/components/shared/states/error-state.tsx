'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/lib/api';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: unknown;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = 'مشکلی پیش آمده است',
  description,
  error,
  onRetry,
  retryLabel = 'تلاش مجدد',
  className,
}: ErrorStateProps) {
  const safeDescription = description ?? (error ? getApiErrorMessage(error) : 'لطفاً دوباره تلاش کنید.');

  return (
    <section
      role="alert"
      className={cn('flex min-h-56 w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center', className)}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle aria-hidden="true" className="size-6" />
      </div>
      <div className="max-w-md space-y-1">
        <h2 className="font-medium">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{safeDescription}</p>
      </div>
      {onRetry ? (
        <Button type="button" variant="outline" onClick={onRetry} className="mt-2">
          <RefreshCw aria-hidden="true" className="me-2 size-4" />
          {retryLabel}
        </Button>
      ) : null}
    </section>
  );
}
