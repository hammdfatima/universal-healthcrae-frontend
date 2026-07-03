"use client"

import type { Route } from "next"
import { useRouter } from "next/navigation"
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

export default function AuthGuard({
  children,
  allowedRoles,
  redirectTo = "/login",
  fallback,
}: AuthGuardProps) {
  const router = useRouter()
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
      router.replace(redirectTo)
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
