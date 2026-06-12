"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { isOnboardingComplete } from "@/app/(dashboards)/patient/_lib/settings"

type OnboardingGuardProps = {
  children: React.ReactNode
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isOnboardingComplete()) {
      router.replace("/onboarding/patient")
      return
    }

    setReady(true)
  }, [router])

  if (!ready) return null

  return children
}
