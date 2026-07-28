import {
  AUTH_STORAGE_KEYS,
  INACTIVITY_TIMEOUT_MS,
  INACTIVITY_WARNING_MS,
} from "@/lib/auth/constants"

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

/** Milliseconds since the last recorded activity, or 0 if unknown. */
export function getIdleMs() {
  if (!canUseStorage()) {
    return 0
  }

  const raw = sessionStorage.getItem(AUTH_STORAGE_KEYS.lastActivity)

  if (!raw) {
    return 0
  }

  const lastActivity = Number(raw)

  if (!Number.isFinite(lastActivity)) {
    return 0
  }

  return Date.now() - lastActivity
}

export function isInactive() {
  if (!canUseStorage()) {
    return false
  }

  return getIdleMs() >= INACTIVITY_TIMEOUT_MS
}

/** True from the warning threshold up until the session actually ends. */
export function isNearInactivityTimeout() {
  if (!canUseStorage()) {
    return false
  }

  const idleMs = getIdleMs()
  return idleMs >= INACTIVITY_WARNING_MS && idleMs < INACTIVITY_TIMEOUT_MS
}
