"use client"

import type { Route } from "next"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { Loader } from "@/components/ui/loader"
import { getPostAuthRedirect } from "@/lib/auth/session"
import { useAuth } from "@/provider/auth-provider"

type GuestGuardProps = {
  children: React.ReactNode
  redirectTo?: Route
}

export default function GuestGuard({ children, redirectTo }: GuestGuardProps) {
  const router = useRouter()
  const { isAuthenticated, isReady, user } = useAuth()

  useEffect(() => {
    if (!isReady || !isAuthenticated || !user) {
      return
    }

    router.replace(redirectTo ?? getPostAuthRedirect(user))
  }, [isAuthenticated, isReady, redirectTo, router, user])

  if (!isReady) {
    return <Loader variant="full-page" label="Loading..." />
  }

  if (isAuthenticated) {
    return <Loader variant="full-page" label="Redirecting..." />
  }

  return children
}
