"use client"

import { useEffect, useState } from "react"

import { LoaderSpinner } from "@/components/ui/loader"

type WakeResponse = {
  ready?: boolean
}

export function BackendWakeupBanner() {
  const [waking, setWaking] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let cancelled = false
    const showTimer = window.setTimeout(() => {
      if (!cancelled) {
        setVisible(true)
      }
    }, 1500)

    async function poll() {
      while (!cancelled) {
        try {
          const response = await fetch("/api/wake", { cache: "no-store" })
          const data = (await response.json()) as WakeResponse
          if (cancelled) {
            return
          }
          if (data.ready) {
            setWaking(false)
            return
          }
          setWaking(true)
        } catch {
          if (!cancelled) {
            setWaking(true)
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }
    }

    void poll()

    return () => {
      cancelled = true
      window.clearTimeout(showTimer)
    }
  }, [])

  if (!visible || !waking) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
      <output
        aria-live="polite"
        className="pointer-events-auto flex max-w-lg items-center gap-3 rounded-lg border border-border bg-background/95 px-4 py-3 text-sm shadow-lg"
      >
        <LoaderSpinner variant="fetch" className="size-5 shrink-0" />
        <span className="text-muted-foreground">
          Waking the API server. On the Render free plan this can take up to a
          minute after inactivity.
        </span>
      </output>
    </div>
  )
}
