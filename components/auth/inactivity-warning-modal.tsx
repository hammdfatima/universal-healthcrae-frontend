"use client"

import { useEffect, useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getIdleMs } from "@/lib/auth/activity"
import { INACTIVITY_TIMEOUT_MS } from "@/lib/auth/constants"

type InactivityWarningModalProps = {
  open: boolean
  onStaySignedIn: () => void
}

function formatCountdown(remainingMs: number) {
  const totalSeconds = Math.max(Math.ceil(remainingMs / 1000), 0)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

/** HIPAA §2.5: warns the patient ~2 minutes before the idle sign-out fires. */
export default function InactivityWarningModal({
  open,
  onStaySignedIn,
}: InactivityWarningModalProps) {
  const [remainingMs, setRemainingMs] = useState(INACTIVITY_TIMEOUT_MS)

  useEffect(() => {
    if (!open) {
      return
    }

    const tick = () => {
      setRemainingMs(Math.max(INACTIVITY_TIMEOUT_MS - getIdleMs(), 0))
    }

    tick()
    const intervalId = window.setInterval(tick, 1_000)

    return () => window.clearInterval(intervalId)
  }, [open])

  return (
    <AlertDialog open={open} onOpenChange={() => {}}>
      <AlertDialogContent
        className="sm:max-w-md"
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Still there?</AlertDialogTitle>
          <AlertDialogDescription>
            For your security, you&apos;ll be signed out due to inactivity in{" "}
            <span className="font-semibold text-foreground">
              {formatCountdown(remainingMs)}
            </span>
            . Select &ldquo;Stay signed in&rdquo; to continue where you left
            off.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onStaySignedIn} className="w-full">
            Stay signed in
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
