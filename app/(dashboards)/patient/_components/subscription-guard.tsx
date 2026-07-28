"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import ErrorCard from "@/components/error-card"
import { Loader } from "@/components/ui/loader"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import {
  SUBSCRIPTIONS_API,
  SUBSCRIPTIONS_QUERY_KEYS,
  type SubscriptionMeResponse,
} from "@/lib/api/subscriptions"
import { isMfaSetupRequiredError } from "@/lib/auth/mfa-setup"
import { updateAuthUser } from "@/lib/auth/session"

type SubscriptionGuardProps = {
  children: React.ReactNode
}

export default function SubscriptionGuard({
  children,
}: SubscriptionGuardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [ready, setReady] = useState(false)
  const isFamilyMember = Boolean(user?.isFamilyMemberAccount)
  // Patient APIs enforce MFA enrollment; skip until setup completes.
  const mfaSetupRequired = Boolean(user?.mfaSetupRequired)

  const {
    data: subscription,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFetch<SubscriptionMeResponse>({
    path: SUBSCRIPTIONS_API.me,
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.me,
    // Family members inherit the owner's plan; login/session already enforce coverage.
    enabled: !isFamilyMember && !mfaSetupRequired,
    staleTime: 60_000,
  })

  useEffect(() => {
    if (isFamilyMember || mfaSetupRequired) {
      setReady(true)
      return
    }

    if (isLoading && !subscription) return

    if (isError && !subscription && isMfaSetupRequiredError(error)) {
      updateAuthUser({ mfaEnabled: false, mfaSetupRequired: true })
      router.replace("/patient/settings?tab=mfa")
      return
    }

    if (isError && !subscription) {
      setReady(false)
      return
    }

    if (!subscription?.isActive) {
      router.replace("/onboarding/subscription")
      return
    }

    setReady(true)
  }, [
    subscription,
    isLoading,
    isError,
    error,
    isFamilyMember,
    mfaSetupRequired,
    router,
  ])

  if (isFamilyMember || mfaSetupRequired) {
    return children
  }

  if (isLoading && !subscription) {
    return <Loader variant="full-page" label="Checking your subscription..." />
  }

  if (isError && !subscription && isMfaSetupRequiredError(error)) {
    return (
      <Loader
        variant="full-page"
        label="Redirecting to authenticator setup..."
      />
    )
  }

  if (isError && !subscription) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <ErrorCard
          error={error}
          isLoading={isFetching}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  if (!ready) {
    return <Loader variant="full-page" label="Checking your subscription..." />
  }

  return children
}
