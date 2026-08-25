"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastSent = useRef<{ path: string; time: number } | null>(null)

  useEffect(() => {
    const path = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    const now = Date.now()
    if (lastSent.current && lastSent.current.path === path && now - lastSent.current.time < 1000) {
      return
    }
    lastSent.current = { path, time: now }

    fetch("/api/portfolio/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {})
  }, [pathname, searchParams])

  return null
}
