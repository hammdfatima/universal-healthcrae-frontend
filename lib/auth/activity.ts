import { AUTH_STORAGE_KEYS, INACTIVITY_TIMEOUT_MS } from "@/lib/auth/constants"

const ACTIVITY_THROTTLE_MS = 1_000

let lastTouchAt = 0

function canUseStorage() {
  return typeof window !== "undefined"
}

export function touchActivity() {
  if (!canUseStorage()) {
    return
  }

  const now = Date.now()

  if (now - lastTouchAt < ACTIVITY_THROTTLE_MS) {
    return
  }

  lastTouchAt = now
  sessionStorage.setItem(AUTH_STORAGE_KEYS.lastActivity, String(now))
}

export function clearActivity() {
  if (!canUseStorage()) {
    return
  }

  lastTouchAt = 0
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.lastActivity)
}

export function isInactive() {
  if (!canUseStorage()) {
    return false
  }

  const raw = sessionStorage.getItem(AUTH_STORAGE_KEYS.lastActivity)

  if (!raw) {
    return false
  }

  const lastActivity = Number(raw)

  if (!Number.isFinite(lastActivity)) {
    return false
  }

  return Date.now() - lastActivity >= INACTIVITY_TIMEOUT_MS
}
