"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Loader } from "@/components/ui/loader"
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
  const [ready, setReady] = useState(false)

  const {
    data: profile,
    isLoading,
    isError,
  } = useFetch<PatientProfileResponse>({
    path: PATIENT_PROFILE_API.get,
    queryKey: PATIENT_PROFILE_QUERY_KEYS.profile,
  })

  useEffect(() => {
    if (isLoading) return

    if (isError || !profile?.onboardingCompleted) {
      router.replace("/onboarding/patient")
      return
    }

    setReady(true)
  }, [profile, isLoading, isError, router])

  if (isLoading || !ready) {
    return <Loader variant="full-page" label="Loading your dashboard..." />
  }

  return children
}
