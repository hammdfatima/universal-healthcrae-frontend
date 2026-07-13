import type { Route } from "next"
import { touchActivity } from "@/lib/auth/activity"
import { AUTH_COOKIE_KEYS, AUTH_STORAGE_KEYS } from "@/lib/auth/constants"
import { dispatchAuthSessionChange } from "@/lib/auth/events"
import type { AuthUser } from "@/lib/auth/types"

export type AuthSession = {
  user: AuthUser
}

function canUseStorage() {
  return typeof window !== "undefined"
}

function setAuthCookies(role: AuthUser["role"]) {
  const maxAge = 60 * 60 * 24
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : ""
  document.cookie = `${AUTH_COOKIE_KEYS.present}=1; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
  document.cookie = `${AUTH_COOKIE_KEYS.role}=${role}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

function clearAuthCookies() {
  document.cookie = `${AUTH_COOKIE_KEYS.present}=; Path=/; Max-Age=0; SameSite=Lax`
  document.cookie = `${AUTH_COOKIE_KEYS.role}=; Path=/; Max-Age=0; SameSite=Lax`
}

/** @deprecated Session JWT is httpOnly; always returns null. */
export function getAuthToken(): string | null {
  return null
}

export function getAuthUser(): AuthUser | null {
  if (!canUseStorage()) {
    return null
  }

  const raw = localStorage.getItem(AUTH_STORAGE_KEYS.user)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function readAuthSession(): AuthSession | null {
  const user = getAuthUser()

  if (!user) {
    return null
  }

  return { user }
}

export function setAuthSession(user: AuthUser) {
  if (!canUseStorage()) {
    return
  }

  localStorage.removeItem(AUTH_STORAGE_KEYS.token)
  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user))
  setAuthCookies(user.role)
  touchActivity()
  dispatchAuthSessionChange()
}

export function updateAuthUser(patch: Partial<AuthUser>) {
  const currentUser = getAuthUser()

  if (!currentUser) {
    return
  }

  setAuthSession({ ...currentUser, ...patch })
}

export function clearAuthSession() {
  if (!canUseStorage()) {
    return
  }

  localStorage.removeItem(AUTH_STORAGE_KEYS.token)
  localStorage.removeItem(AUTH_STORAGE_KEYS.user)
  clearAuthCookies()
  dispatchAuthSessionChange()
}

export function setResetToken(token: string) {
  if (!canUseStorage()) {
    return
  }

  sessionStorage.setItem(AUTH_STORAGE_KEYS.resetToken, token)
}

export function getResetToken() {
  if (!canUseStorage()) {
    return null
  }

  return sessionStorage.getItem(AUTH_STORAGE_KEYS.resetToken)
}

export function clearResetToken() {
  if (!canUseStorage()) {
    return
  }

  sessionStorage.removeItem(AUTH_STORAGE_KEYS.resetToken)
}

export function getPostAuthRedirect(user: AuthUser): Route {
  if (user.mustChangePassword) {
    return "/patient/change-password" as Route
  }

  return user.role === "ADMIN" ? "/admin" : "/patient"
}
