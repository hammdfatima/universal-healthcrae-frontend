"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Loader } from "@/components/ui/loader"
import { useFetch } from "@/hooks/use-fetch"
import {
  SUBSCRIPTIONS_API,
  SUBSCRIPTIONS_QUERY_KEYS,
  type SubscriptionMeResponse,
} from "@/lib/api/subscriptions"

type SubscriptionGuardProps = {
  children: React.ReactNode
}

export default function SubscriptionGuard({
  children,
}: SubscriptionGuardProps) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  const {
    data: subscription,
    isLoading,
    isError,
  } = useFetch<SubscriptionMeResponse>({
    path: SUBSCRIPTIONS_API.me,
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.me,
  })

  useEffect(() => {
    if (isLoading) return

    if (isError || !subscription?.isActive) {
      router.replace("/onboarding/subscription")
      return
    }

    setReady(true)
  }, [subscription, isLoading, isError, router])

  if (isLoading || !ready) {
    return <Loader variant="full-page" label="Checking your subscription..." />
  }

  return children
}
