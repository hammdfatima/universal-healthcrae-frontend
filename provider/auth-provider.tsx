"use client"

import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import type { Route } from "next"
import { useRouter } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import SessionExpiredModal from "@/components/auth/session-expired-modal"
import { env } from "@/env"
import useToast from "@/hooks/use-toast"
import { AUTH_API } from "@/lib/api/auth"
import { clearActivity, isInactive, touchActivity } from "@/lib/auth/activity"
import type { SessionEndReason } from "@/lib/auth/constants"
import { AUTH_SESSION_CHANGE_EVENT } from "@/lib/auth/events"
import { hasRole, isAdmin, isUser } from "@/lib/auth/roles"
import {
  clearAuthSession,
  getAuthToken,
  getPostAuthRedirect,
  readAuthSession,
  setAuthSession,
} from "@/lib/auth/session"
import { isAccessTokenExpired } from "@/lib/auth/token"
import type { AuthTokenResponse, AuthUser, UserRole } from "@/lib/auth/types"
import { registerSessionEndHandler } from "@/lib/auth/unauthorized"
import { buildRequestUrl } from "@/lib/utils"

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isReady: boolean
  isAdmin: boolean
  isUser: boolean
  hasRole: (roles: UserRole[]) => boolean
  login: (session: AuthTokenResponse) => void
  logout: (redirectTo?: Route) => void
  refreshSession: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const SESSION_CHECK_INTERVAL_MS = 30_000
const SESSION_VALIDATION_INTERVAL_MS = 20_000
const ACTIVITY_EVENTS = [
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
] as const

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toastError } = useToast()
  const [session, setSession] = useState<{
    token: string
    user: AuthUser
  } | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [sessionEndReason, setSessionEndReason] =
    useState<SessionEndReason | null>(null)
  const sessionEndHandledRef = useRef(false)

  const endSession = useCallback((reason: SessionEndReason) => {
    if (sessionEndHandledRef.current) {
      return
    }

    sessionEndHandledRef.current = true
    setSessionEndReason(reason)
  }, [])

  const refreshSession = useCallback(() => {
    const nextSession = readAuthSession()

    if (!nextSession) {
      clearAuthSession()
      clearActivity()
    }

    setSession(nextSession)
    setIsReady(true)
  }, [])

  const logout = useCallback(
    (redirectTo: Route = "/login") => {
      clearAuthSession()
      clearActivity()
      setSession(null)
      setSessionEndReason(null)
      sessionEndHandledRef.current = false
      queryClient.clear()
      router.push(redirectTo)
    },
    [queryClient, router]
  )

  const confirmSessionEnd = useCallback(() => {
    logout("/login")
  }, [logout])

  const login = useCallback((authSession: AuthTokenResponse) => {
    sessionEndHandledRef.current = false
    setSessionEndReason(null)
    setAuthSession(authSession.token, authSession.user)
    setSession({
      token: authSession.token,
      user: authSession.user,
    })
  }, [])

  const checkLocalSessionState = useCallback(
    (token: string) => {
      if (isAccessTokenExpired(token)) {
        endSession("expired")
        return false
      }

      if (isInactive()) {
        endSession("inactive")
        return false
      }

      return true
    },
    [endSession]
  )

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  useEffect(() => {
    const syncSession = () => refreshSession()

    window.addEventListener(AUTH_SESSION_CHANGE_EVENT, syncSession)
    window.addEventListener("storage", syncSession)

    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGE_EVENT, syncSession)
      window.removeEventListener("storage", syncSession)
    }
  }, [refreshSession])

  useEffect(() => {
    return registerSessionEndHandler(endSession)
  }, [endSession])

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error) && getAuthToken()) {
          const status = error.response?.status
          const message = error.response?.data?.message as string | undefined
          const isBlocked =
            status === 403 && message?.toLowerCase().includes("blocked")
          const isSessionExpired = status === 401

          if (isBlocked) {
            if (message) {
              toastError(message)
            }
            endSession("blocked")
          } else if (isSessionExpired) {
            endSession("revoked")
          }
        }

        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [endSession, toastError])

  useEffect(() => {
    if (!session?.token || sessionEndReason) {
      return
    }

    if (!checkLocalSessionState(session.token)) {
      return
    }

    touchActivity()

    const onActivity = () => touchActivity()

    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, onActivity, { passive: true })
    }

    const intervalId = window.setInterval(() => {
      checkLocalSessionState(session.token)
    }, SESSION_CHECK_INTERVAL_MS)

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkLocalSessionState(session.token)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, onActivity)
      }
      window.clearInterval(intervalId)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [checkLocalSessionState, session?.token, sessionEndReason])

  useEffect(() => {
    if (!session?.token || sessionEndReason) {
      return
    }

    const validateSession = async () => {
      if (document.visibilityState !== "visible") {
        return
      }

      if (!checkLocalSessionState(session.token)) {
        return
      }

      try {
        await axios.get(
          buildRequestUrl(env.NEXT_PUBLIC_API_URL, AUTH_API.session),
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        )
      } catch {
        // Interceptor handles blocked or revoked sessions.
      }
    }

    void validateSession()

    const intervalId = window.setInterval(
      validateSession,
      SESSION_VALIDATION_INTERVAL_MS
    )
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void validateSession()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [checkLocalSessionState, session?.token, sessionEndReason])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session),
      isReady,
      isAdmin: session ? isAdmin(session.user.role) : false,
      isUser: session ? isUser(session.user.role) : false,
      hasRole: (roles) => (session ? hasRole(session.user.role, roles) : false),
      login,
      logout,
      refreshSession,
    }),
    [session, isReady, login, logout, refreshSession]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionExpiredModal
        open={sessionEndReason !== null}
        reason={sessionEndReason}
        onConfirm={confirmSessionEnd}
      />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}

export function useOptionalAuth() {
  return useContext(AuthContext)
}

export { getPostAuthRedirect }
