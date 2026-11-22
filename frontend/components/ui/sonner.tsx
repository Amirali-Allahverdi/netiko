"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircleIcon } from "@solar-icons/react/bold/check-circle"
import { InfoCircleIcon } from "@solar-icons/react/bold/info-circle"
import { DangerTriangleIcon } from "@solar-icons/react/bold/danger-triangle"
import { CloseCircleIcon } from "@solar-icons/react/bold/close-circle"
import { LoaderIcon } from "@solar-icons/react/bold/loader"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CheckCircleIcon size={4} />,
        info: <InfoCircleIcon size={4} />,
        warning: <DangerTriangleIcon size={4} />,
        error: <CloseCircleIcon size={4} />,
        loading: <LoaderIcon size={4} className="animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
