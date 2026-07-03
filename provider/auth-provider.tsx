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
  useState,
} from "react"

import { AUTH_SESSION_CHANGE_EVENT } from "@/lib/auth/events"
import { hasRole, isAdmin, isUser } from "@/lib/auth/roles"
import {
  clearAuthSession,
  getPostAuthRedirect,
  readAuthSession,
  setAuthSession,
} from "@/lib/auth/session"
import type { AuthTokenResponse, AuthUser, UserRole } from "@/lib/auth/types"
import { registerUnauthorizedHandler } from "@/lib/auth/unauthorized"

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [session, setSession] = useState<{
    token: string
    user: AuthUser
  } | null>(null)
  const [isReady, setIsReady] = useState(false)

  const refreshSession = useCallback(() => {
    const nextSession = readAuthSession()

    if (!nextSession) {
      clearAuthSession()
    }

    setSession(nextSession)
    setIsReady(true)
  }, [])

  const logout = useCallback(
    (redirectTo: Route = "/login") => {
      clearAuthSession()
      setSession(null)
      queryClient.clear()
      router.push(redirectTo)
    },
    [queryClient, router]
  )

  const login = useCallback((authSession: AuthTokenResponse) => {
    setAuthSession(authSession.token, authSession.user)
    setSession({
      token: authSession.token,
      user: authSession.user,
    })
  }, [])

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
    return registerUnauthorizedHandler(() => logout("/login"))
  }, [logout])

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status
          const message = error.response?.data?.message as string | undefined

          if (
            status === 401 ||
            (status === 403 && message?.toLowerCase().includes("blocked"))
          ) {
            logout("/login")
          }
        }

        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [logout])

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
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
