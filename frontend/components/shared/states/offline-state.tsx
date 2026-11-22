import { WiFiCrossIcon } from "@solar-icons/react/bold/wi-fi-cross"
import { cn } from "@/lib/utils"

interface OfflineStateProps {
  title?: string
  description?: string
  className?: string
}

export function OfflineState({
  title = "اتصال اینترنت برقرار نیست",
  description = "اتصال خود را بررسی کنید. پس از برقراری ارتباط می‌توانید دوباره تلاش کنید.",
  className,
}: OfflineStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-muted/30 p-4",
        className
      )}
    >
      <WiFiCrossIcon aria-hidden="true" size={5} />
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
