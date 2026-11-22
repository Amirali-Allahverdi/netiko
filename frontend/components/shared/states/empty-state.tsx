'use client';

import { Inbox } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <Inbox aria-hidden="true" className="size-6" />}
      </div>
      <div className="max-w-md space-y-1">
        <h2 id={titleId} className="font-medium">{title}</h2>
        {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {action ? (
        <Button type="button" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      ) : null}
    </section>
  );
}
