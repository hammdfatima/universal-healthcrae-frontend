"use client"

import type { Route } from "next"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

import { Loader } from "@/components/ui/loader"
import useToast from "@/hooks/use-toast"
import { getPostAuthRedirect } from "@/lib/auth/session"
import type { UserRole } from "@/lib/auth/types"
import { useAuth } from "@/provider/auth-provider"

type AuthGuardProps = {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: Route
  fallback?: React.ReactNode
}

function buildLoginRedirect(pathname: string, search: string): Route {
  const returnTo = `${pathname}${search ? `?${search}` : ""}`
  // Only bounce back to in-app paths after sign-in.
  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/login"
  }

  return `/login?next=${encodeURIComponent(returnTo)}` as Route
}

export default function AuthGuard({
  children,
  allowedRoles,
  redirectTo = "/login",
  fallback,
}: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toastError } = useToast()
  const { isAuthenticated, isReady, user, hasRole } = useAuth()

  const isAuthorized =
    isAuthenticated &&
    user &&
    (!allowedRoles || allowedRoles.length === 0 || hasRole(allowedRoles))

  useEffect(() => {
    if (!isReady) {
      return
    }

    if (!isAuthenticated || !user) {
      // Read search client-side only to keep AuthGuard compatible with static
      // prerendering under the App Router.
      const search =
        typeof window !== "undefined"
          ? window.location.search.replace(/^\?/, "")
          : ""
      const target =
        redirectTo === "/login"
          ? buildLoginRedirect(pathname, search)
          : redirectTo
      router.replace(target)
      return
    }

    if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
      toastError("You do not have permission to access this area.")
      router.replace(getPostAuthRedirect(user))
    }
  }, [
    allowedRoles,
    hasRole,
    isAuthenticated,
    isReady,
    pathname,
    redirectTo,
    router,
    toastError,
    user,
  ])

  if (!isReady) {
    return (
      fallback ?? (
        <Loader variant="full-page" label="Checking your session..." />
      )
    )
  }

  if (!isAuthorized) {
    return fallback ?? <Loader variant="full-page" label="Redirecting..." />
  }

  return children
}
