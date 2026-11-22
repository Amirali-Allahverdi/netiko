import { ShieldX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccessDeniedStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function AccessDeniedState({
  title = 'دسترسی امکان‌پذیر نیست',
  description = 'شما مجوز لازم برای مشاهده این بخش یا انجام این عملیات را ندارید.',
  className,
}: AccessDeniedStateProps) {
  return (
    <section role="alert" className={cn('flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-10 text-center', className)}>
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <ShieldX aria-hidden="true" className="size-6" />
      </div>
      <div className="max-w-md space-y-1">
        <h2 className="font-medium">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}
