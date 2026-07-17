"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import ErrorCard from "@/components/error-card"
import { Loader } from "@/components/ui/loader"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import {
  PATIENT_PROFILE_API,
  PATIENT_PROFILE_QUERY_KEYS,
  type PatientProfileResponse,
} from "@/lib/api/patient-profile"

type OnboardingGuardProps = {
  children: React.ReactNode
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [ready, setReady] = useState(false)
  const isFamilyMember = Boolean(user?.isFamilyMemberAccount)

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFetch<PatientProfileResponse>({
    path: PATIENT_PROFILE_API.get,
    queryKey: PATIENT_PROFILE_QUERY_KEYS.profile,
    // Managed family accounts are created with onboarding completed and their
    // access is validated during login/session checks. Do not let an unnecessary
    // profile request block their entire dashboard.
    enabled: Boolean(user) && !isFamilyMember,
    staleTime: 60_000,
  })

  useEffect(() => {
    if (isFamilyMember) {
      setReady(true)
      return
    }

    // Still loading the first response — wait.
    if (isLoading && !profile) return

    // Only block the app when we have no usable profile yet.
    // A background refetch failure must not cover the dashboard.
    if (isError && !profile) {
      setReady(false)
      return
    }

    if (!profile?.onboardingCompleted) {
      router.replace("/onboarding/patient")
      return
    }

    setReady(true)
  }, [profile, isLoading, isError, isFamilyMember, router])

  if (isFamilyMember) {
    return children
  }

  if (isLoading && !profile) {
    return <Loader variant="full-page" label="Loading your dashboard..." />
  }

  if (isError && !profile) {
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
    return <Loader variant="full-page" label="Loading your dashboard..." />
  }

  return children
}
