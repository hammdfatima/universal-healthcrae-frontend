"use client"

import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { env } from "@/env"
import { useFetch } from "@/hooks/use-fetch"
import {
  SUBSCRIPTIONS_API,
  SUBSCRIPTIONS_QUERY_KEYS,
  type SubscriptionMeResponse,
} from "@/lib/api/subscriptions"
import { getAuthToken } from "@/lib/auth/session"
import { buildRequestUrl } from "@/lib/utils"

function SubscriptionSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const { refetch } = useFetch<SubscriptionMeResponse>({
    path: SUBSCRIPTIONS_API.me,
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.me,
    enabled: false,
  })

  useEffect(() => {
    async function verifyAndRedirect() {
      if (!sessionId) {
        router.replace("/onboarding/subscription")
        return
      }

      try {
        const token = getAuthToken()
        await axios.get(
          buildRequestUrl(
            env.NEXT_PUBLIC_API_URL,
            SUBSCRIPTIONS_API.verifyCheckout(sessionId)
          ),
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        )

        await refetch()
        router.replace("/patient")
      } catch {
        router.replace("/onboarding/subscription")
      }
    }

    verifyAndRedirect()
  }, [sessionId, router, refetch])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <Loader variant="fetch" label="Confirming your subscription..." />
      <Typography variant="muted">
        Please wait while we activate your plan.
      </Typography>
    </div>
  )
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <Loader variant="fetch" label="Loading..." className="min-h-[50vh]" />
      }
    >
      <SubscriptionSuccessContent />
    </Suspense>
  )
}
