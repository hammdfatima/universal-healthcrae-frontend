"use client"

import { CreditCard } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import type { SubscriptionPlan } from "@/app/(dashboards)/admin/_lib/subscription-plans"
import SubscriptionPlansPicker from "@/components/subscription-plans-picker"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  PATIENT_PROFILE_API,
  PATIENT_PROFILE_QUERY_KEYS,
  type PatientProfileResponse,
} from "@/lib/api/patient-profile"
import {
  SUBSCRIPTIONS_API,
  SUBSCRIPTIONS_QUERY_KEYS,
  type SubscriptionMeResponse,
} from "@/lib/api/subscriptions"

export default function OnboardingSubscriptionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectingPlanId, setSelectingPlanId] = useState<string | null>(null)
  const cancelled = searchParams.get("cancelled") === "true"

  const { data: profile, isLoading: isProfileLoading } =
    useFetch<PatientProfileResponse>({
      path: PATIENT_PROFILE_API.get,
      queryKey: PATIENT_PROFILE_QUERY_KEYS.profile,
    })

  const { data: subscription, isLoading: isSubscriptionLoading } =
    useFetch<SubscriptionMeResponse>({
      path: SUBSCRIPTIONS_API.me,
      queryKey: SUBSCRIPTIONS_QUERY_KEYS.me,
    })

  const { onRequest: createCheckout } = useApi<{ planId: string }>({
    key: "subscription-checkout",
    method: "post",
    showSuccessToast: false,
  })

  useEffect(() => {
    if (isProfileLoading) return

    if (!profile?.onboardingCompleted) {
      router.replace("/onboarding/patient")
    }
  }, [profile, isProfileLoading, router])

  useEffect(() => {
    if (isSubscriptionLoading) return

    if (subscription?.isActive) {
      router.replace("/patient")
    }
  }, [subscription, isSubscriptionLoading, router])

  function handleSelectPlan(plan: SubscriptionPlan) {
    setSelectingPlanId(plan.id)

    createCheckout({
      path: SUBSCRIPTIONS_API.checkout,
      data: { planId: plan.id },
      onSuccess: (session) => {
        window.location.href = session.checkoutUrl
      },
      onError: () => {
        setSelectingPlanId(null)
      },
    })
  }

  if (isProfileLoading || isSubscriptionLoading) {
    return <Loader variant="fetch" label="Loading..." className="py-24" />
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
        <div className="bg-gradient-to-br from-secondary via-secondary to-primary px-6 py-8 text-secondary-foreground sm:px-8">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <CreditCard className="size-6" aria-hidden />
            </span>
            <div>
              <Typography
                as="h1"
                variant="h3"
                color="inherit"
                className="text-secondary-foreground"
              >
                Choose your subscription
              </Typography>
              <Typography
                variant="muted"
                color="inherit"
                className="mt-2 max-w-2xl text-secondary-foreground/85"
              >
                An active subscription is required to access your patient
                dashboard and medical vault. Select a plan below to continue
                securely with Stripe checkout.
              </Typography>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-8">
          {cancelled ? (
            <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800">
              Checkout was cancelled. Please select a plan to access your
              dashboard.
            </div>
          ) : null}

          <SubscriptionPlansPicker
            onSelectPlan={handleSelectPlan}
            selectingPlanId={selectingPlanId}
            actionLabel="Subscribe & Continue"
          />
        </div>
      </div>
    </div>
  )
}
