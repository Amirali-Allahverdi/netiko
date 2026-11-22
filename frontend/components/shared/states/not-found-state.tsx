import { FileQuestionMarkIcon } from "@solar-icons/react/bold/file-question-mark"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NotFoundStateProps {
  title?: string
  description?: string
  backHref?: string
  backLabel?: string
  className?: string
}

export function NotFoundState({
  title = "موردی پیدا نشد",
  description = "صفحه یا اطلاعاتی که به دنبال آن هستید وجود ندارد یا منتقل شده است.",
  backHref = "/",
  backLabel = "بازگشت به صفحه اصلی",
  className,
}: NotFoundStateProps) {
  return (
    <section
      className={cn(
        "flex min-h-[55svh] flex-col items-center justify-center gap-3 px-6 text-center",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileQuestionMarkIcon aria-hidden="true" size={7} />
      </div>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      <Button className="mt-2">
        <Link href={backHref}>{backLabel}</Link>
      </Button>
    </section>
  )
}
