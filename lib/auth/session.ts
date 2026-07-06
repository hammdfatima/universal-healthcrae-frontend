import type { Route } from "next"

import { AUTH_STORAGE_KEYS } from "@/lib/auth/constants"
import { dispatchAuthSessionChange } from "@/lib/auth/events"
import { isAccessTokenExpired } from "@/lib/auth/token"
import type { AuthUser } from "@/lib/auth/types"

export type AuthSession = {
  token: string
  user: AuthUser
}

function canUseStorage() {
  return typeof window !== "undefined"
}

export function getAuthToken() {
  if (!canUseStorage()) {
    return null
  }

  return localStorage.getItem(AUTH_STORAGE_KEYS.token)
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
  const token = getAuthToken()
  const user = getAuthUser()

  if (!token || !user || isAccessTokenExpired(token)) {
    return null
  }

  return { token, user }
}

export function setAuthSession(token: string, user: AuthUser) {
  if (!canUseStorage()) {
    return
  }

  localStorage.setItem(AUTH_STORAGE_KEYS.token, token)
  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user))
  dispatchAuthSessionChange()
}

export function updateAuthUser(patch: Partial<AuthUser>) {
  const currentUser = getAuthUser()
  const token = getAuthToken()

  if (!currentUser || !token) {
    return
  }

  setAuthSession(token, { ...currentUser, ...patch })
}

export function clearAuthSession() {
  if (!canUseStorage()) {
    return
  }

  localStorage.removeItem(AUTH_STORAGE_KEYS.token)
  localStorage.removeItem(AUTH_STORAGE_KEYS.user)
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
