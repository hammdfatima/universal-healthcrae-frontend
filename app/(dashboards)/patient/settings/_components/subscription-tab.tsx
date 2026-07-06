"use client"

import axios from "axios"
import { format, parseISO } from "date-fns"
import { CreditCard } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import ChangePlanDialog from "@/app/(dashboards)/patient/settings/_components/change-plan-dialog"
import ErrorCard from "@/components/error-card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { env } from "@/env"
import useApi from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import {
  SUBSCRIPTIONS_API,
  SUBSCRIPTIONS_QUERY_KEYS,
  type SubscriptionMeResponse,
  type UserSubscription,
} from "@/lib/api/subscriptions"
import { getAuthToken } from "@/lib/auth/session"
import { buildRequestUrl } from "@/lib/utils"

function formatBillingCycle(cycle: UserSubscription["plan"]["billingCycle"]) {
  return cycle === "yearly" ? "Yearly" : "Monthly"
}

function formatPrice(subscription: UserSubscription) {
  const suffix = subscription.plan.billingCycle === "yearly" ? "/yr" : "/mo"
  return `${subscription.plan.price}${suffix}`
}

function formatNextBillingDate(value: string | null) {
  if (!value) return "—"

  try {
    return format(parseISO(value), "MMM d, yyyy")
  } catch {
    return "—"
  }
}

function getStatusLabel(subscription: UserSubscription) {
  if (subscription.cancelAtPeriodEnd) {
    return "Cancelling"
  }

  if (subscription.status === "active" || subscription.status === "trialing") {
    return "Active"
  }

  if (subscription.status === "cancelled") {
    return "Cancelled"
  }

  if (subscription.status === "past_due") {
    return "Past Due"
  }

  return "Inactive"
}

function getStatusBadgeClass(subscription: UserSubscription) {
  if (subscription.cancelAtPeriodEnd) {
    return "w-fit rounded-full bg-amber-500/10 text-amber-700 hover:bg-amber-500/10"
  }

  if (subscription.status === "active" || subscription.status === "trialing") {
    return "w-fit rounded-full bg-primary/10 text-primary hover:bg-primary/10"
  }

  return "w-fit rounded-full bg-destructive/10 text-destructive hover:bg-destructive/10"
}

export default function SubscriptionTab() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const isAccountOwner = !user?.isFamilyMemberAccount
  const [planDialogOpen, setPlanDialogOpen] = useState(false)

  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<SubscriptionMeResponse>({
      path: SUBSCRIPTIONS_API.me,
      queryKey: SUBSCRIPTIONS_QUERY_KEYS.me,
    })

  const { onRequest: cancelSubscription, isPending: isCancelling } = useApi<
    Record<string, never>
  >({
    key: "cancel-subscription",
    method: "post",
  })

  const subscription = data?.subscription ?? null

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (!sessionId) return

    const token = getAuthToken()
    const verifyUrl = buildRequestUrl(
      env.NEXT_PUBLIC_API_URL,
      SUBSCRIPTIONS_API.verifyCheckout(sessionId)
    )

    void axios
      .get(verifyUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then(() => refetch())
      .finally(() => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("session_id")
        params.delete("cancelled")
        const next = params.toString()
        router.replace(
          next
            ? `/patient/settings?${next}`
            : "/patient/settings?tab=subscription"
        )
      })
  }, [refetch, router, searchParams])

  if (!isAccountOwner) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <Typography variant="muted">
          Subscription billing is managed by the primary account holder.
        </Typography>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <Loader
          variant="fetch"
          label="Loading subscription..."
          className="py-16"
        />
      </div>
    )
  }

  if (isError && error) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <ErrorCard
          error={error}
          onRetry={() => refetch()}
          isLoading={isFetching}
        />
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <Typography variant="h4">No subscription found</Typography>
        <Typography variant="muted" className="mt-2">
          Choose a plan to activate your account.
        </Typography>
        <Button
          type="button"
          className="mt-4"
          onClick={() => setPlanDialogOpen(true)}
        >
          Choose Plan
        </Button>
        <ChangePlanDialog
          open={planDialogOpen}
          onOpenChange={setPlanDialogOpen}
          currentPlanId={null}
          onPlanChanged={() => refetch()}
        />
      </div>
    )
  }

  const canCancel =
    !subscription.cancelAtPeriodEnd &&
    (subscription.status === "active" ||
      subscription.status === "trialing" ||
      subscription.status === "past_due")

  return (
    <>
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CreditCard className="size-5" aria-hidden />
            </span>
            <div>
              <Typography as="h2" variant="h4">
                Current Plan
              </Typography>
              <Typography variant="muted" className="mt-1">
                Manage your subscription and billing preferences.
              </Typography>
            </div>
          </div>

          <Badge className={getStatusBadgeClass(subscription)}>
            {getStatusLabel(subscription)}
          </Badge>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SubscriptionDetail label="Plan" value={subscription.plan.planName} />
          <SubscriptionDetail label="Price" value={formatPrice(subscription)} />
          <SubscriptionDetail
            label="Billing Cycle"
            value={formatBillingCycle(subscription.plan.billingCycle)}
          />
          <SubscriptionDetail
            label={
              subscription.cancelAtPeriodEnd
                ? "Access Until"
                : "Next Billing Date"
            }
            value={formatNextBillingDate(subscription.currentPeriodEnd)}
          />
        </div>

        {subscription.cancelAtPeriodEnd ? (
          <Typography variant="muted" className="mt-4 text-sm">
            Your subscription will remain active until{" "}
            {formatNextBillingDate(subscription.currentPeriodEnd)}. You can
            change your plan before then to keep your access.
          </Typography>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={() => setPlanDialogOpen(true)}>
            Change Plan
          </Button>

          {canCancel ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <Loader variant="button" color="white" />
                  ) : (
                    "Cancel Subscription"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your plan will remain active until the end of the current
                    billing period. You can change your plan again at any time
                    before access ends.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isCancelling}
                    onClick={() => {
                      cancelSubscription({
                        path: SUBSCRIPTIONS_API.cancel,
                        data: {},
                        onSuccess: () => {
                          refetch()
                        },
                      })
                    }}
                  >
                    Cancel Subscription
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </div>
      </div>

      <ChangePlanDialog
        open={planDialogOpen}
        onOpenChange={setPlanDialogOpen}
        currentPlanId={subscription.plan.id}
        onPlanChanged={() => refetch()}
      />
    </>
  )
}

function SubscriptionDetail({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-background px-4 py-3">
      <Typography variant="muted" className="text-xs">
        {label}
      </Typography>
      <Typography variant="small" className="mt-1 font-semibold">
        {value}
      </Typography>
    </div>
  )
}
