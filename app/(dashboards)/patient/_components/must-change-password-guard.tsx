"use client"

import type { Route } from "next"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Loader } from "@/components/ui/loader"
import { useAuth } from "@/hooks/use-auth"

type MustChangePasswordGuardProps = {
  children: React.ReactNode
}

export default function MustChangePasswordGuard({
  children,
}: MustChangePasswordGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isReady } = useAuth()
  const [allowed, setAllowed] = useState(false)
  const isChangePasswordPage = pathname === "/patient/change-password"

  useEffect(() => {
    if (!isReady || !user) {
      return
    }

    if (user.mustChangePassword) {
      if (isChangePasswordPage) {
        setAllowed(true)
        return
      }

      router.replace("/patient/change-password" as Route)
      return
    }

    if (isChangePasswordPage) {
      router.replace("/patient")
      return
    }

    setAllowed(true)
  }, [isChangePasswordPage, isReady, router, user])

  if (!isReady || !allowed) {
    return <Loader variant="full-page" label="Loading your account..." />
  }

  return children
}
