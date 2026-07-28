"use client"

import { ShieldAlert } from "lucide-react"
import type { Route } from "next"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader } from "@/components/ui/loader"
import { useAuth } from "@/hooks/use-auth"

type MfaSetupGuardProps = {
  /** Full dashboard tree (onboarding → subscription → shell). */
  children: React.ReactNode
  /** Page content only — used during MFA enrollment so shell APIs are not called. */
  page: React.ReactNode
}

const SETTINGS_PATH = "/patient/settings"

/**
 * HIPAA §2.5: patients without authenticator MFA enabled are nudged to the
 * security tab right after sign-in. This guard is a defense-in-depth backstop
 * — it blocks navigation to every other patient route until MFA is enabled,
 * while leaving the settings page itself reachable so setup can be completed.
 */
export default function MfaSetupGuard({ children, page }: MfaSetupGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isReady } = useAuth()
  const isSettingsPage = pathname === SETTINGS_PATH
  const mfaSetupRequired = Boolean(user?.mfaSetupRequired)

  useEffect(() => {
    if (!isReady || !user || !mfaSetupRequired || isSettingsPage) {
      return
    }

    router.replace(`${SETTINGS_PATH}?tab=mfa` as Route)
  }, [isReady, user, mfaSetupRequired, isSettingsPage, router])

  if (!isReady || !user) {
    return children
  }

  if (mfaSetupRequired && !isSettingsPage) {
    return (
      <Loader
        variant="full-page"
        label="Redirecting to authenticator setup..."
      />
    )
  }

  if (mfaSetupRequired && isSettingsPage) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 pt-4">
          <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
            <ShieldAlert className="text-amber-600 dark:text-amber-400" />
            <AlertTitle>Set up two-factor authentication</AlertTitle>
            <AlertDescription>
              HIPAA requires an extra layer of protection on your health
              records. Finish setting up authenticator MFA below to keep using
              your account.
            </AlertDescription>
          </Alert>
        </div>
        {page}
      </div>
    )
  }

  return children
}
