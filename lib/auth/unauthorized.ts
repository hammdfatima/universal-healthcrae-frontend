import type { SessionEndReason } from "@/lib/auth/constants"
import { isLoggingOut } from "@/lib/auth/logout-state"

type SessionEndHandler = ((reason: SessionEndReason) => void) | null

let sessionEndHandler: SessionEndHandler = null

export function registerSessionEndHandler(
  handler: (reason: SessionEndReason) => void
) {
  sessionEndHandler = handler

  return () => {
    if (sessionEndHandler === handler) {
      sessionEndHandler = null
    }
  }
}

export function handleSessionEnd(reason: SessionEndReason) {
  if (isLoggingOut()) {
    return
  }

  sessionEndHandler?.(reason)
}

/** @deprecated Use handleSessionEnd("revoked") */
export function registerUnauthorizedHandler(handler: () => void) {
  return registerSessionEndHandler(() => handler())
}

export function handleUnauthorized() {
  handleSessionEnd("revoked")
}
