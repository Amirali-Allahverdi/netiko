"use client"

import { Toaster } from "@/components/ui/sonner"

/**
 * Uses the shadcn/ui Sonner primitive. Mount once near the application root.
 * Trigger notifications with `toast` from `sonner` at the feature/action layer.
 */
export function AppToaster() {
  return <Toaster richColors position="top-center" closeButton />
}
