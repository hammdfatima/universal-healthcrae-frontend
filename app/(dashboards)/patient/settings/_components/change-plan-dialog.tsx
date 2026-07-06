"use client"

import { Check } from "lucide-react"
import { useState } from "react"

import type { SubscriptionPlan } from "@/app/(dashboards)/admin/_lib/subscription-plans"
import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  SUBSCRIPTION_PLANS_API,
  SUBSCRIPTION_PLANS_QUERY_KEYS,
} from "@/lib/api/subscription-plans"
import {
  type ChangePlanResponse,
  SUBSCRIPTIONS_API,
} from "@/lib/api/subscriptions"
import { cn } from "@/lib/utils"

type ChangePlanDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlanId: string | null
  onPlanChanged: () => void
}

function formatBillingLabel(cycle: SubscriptionPlan["billingCycle"]) {
  return cycle === "yearly" ? "/year" : "/month"
}

export default function ChangePlanDialog({
  open,
  onOpenChange,
  currentPlanId,
  onPlanChanged,
}: ChangePlanDialogProps) {
  const [selectingPlanId, setSelectingPlanId] = useState<string | null>(null)

  const {
    data: plans = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFetch<SubscriptionPlan[]>({
    path: SUBSCRIPTION_PLANS_API.public.list,
    queryKey: SUBSCRIPTION_PLANS_QUERY_KEYS.public,
    enabled: open,
  })

  const { onRequest: changePlan } = useApi<{ planId: string }>({
    key: "change-subscription-plan",
    method: "post",
  })

  function handleSelectPlan(plan: SubscriptionPlan) {
    setSelectingPlanId(plan.id)

    changePlan({
      path: SUBSCRIPTIONS_API.changePlan,
      data: { planId: plan.id },
      onSuccess: (result: ChangePlanResponse) => {
        if (result.mode === "checkout") {
          window.location.href = result.checkoutUrl
          return
        }

        onPlanChanged()
        onOpenChange(false)
        setSelectingPlanId(null)
      },
      onError: () => {
        setSelectingPlanId(null)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
          <DialogTitle>Change Plan</DialogTitle>
          <DialogDescription>
            Choose the plan that best fits your household.
          </DialogDescription>
        </DialogHeader>

        <div className="thin-scrollbar overflow-y-auto px-6 py-5">
          {isLoading ? (
            <Loader
              variant="fetch"
              label="Loading plans..."
              className="py-16"
            />
          ) : null}

          {isError && error ? (
            <ErrorCard
              error={error}
              onRetry={() => refetch()}
              isLoading={isFetching}
            />
          ) : null}

          {!isLoading && !isError && plans.length === 0 ? (
            <EmptyCard
              title="No plans available"
              description="Subscription plans are not available right now."
            />
          ) : null}

          {!isLoading && !isError && plans.length > 0 ? (
            <ul className="grid gap-4 lg:grid-cols-3">
              {plans.map((plan, index) => {
                const highlighted = index === 1 && plans.length > 1
                const isCurrent = plan.id === currentPlanId
                const isSelecting = selectingPlanId === plan.id

                return (
                  <li key={plan.id}>
                    <div
                      className={cn(
                        "flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm",
                        highlighted
                          ? "border-primary ring-2 ring-primary/15"
                          : "border-border/60",
                        isCurrent && "border-secondary ring-2 ring-secondary/20"
                      )}
                    >
                      <div className="mb-4 flex items-start justify-between gap-2">
                        <div>
                          <Typography variant="small" className="font-semibold">
                            {plan.planName}
                          </Typography>
                          <Typography
                            variant="muted"
                            className="text-xs capitalize"
                          >
                            {plan.billingCycle} billing
                          </Typography>
                        </div>
                        {highlighted ? (
                          <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                            Popular
                          </Badge>
                        ) : null}
                      </div>

                      <div className="flex items-baseline gap-1">
                        <Typography as="span" variant="h3">
                          {plan.price}
                        </Typography>
                        <Typography variant="muted" className="text-sm">
                          {formatBillingLabel(plan.billingCycle)}
                        </Typography>
                      </div>

                      <ul className="mt-4 flex-1 space-y-2">
                        {plan.features.slice(0, 4).map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check
                              className="mt-0.5 size-4 shrink-0 text-primary"
                              aria-hidden
                            />
                            <Typography variant="muted" className="text-xs">
                              {feature}
                            </Typography>
                          </li>
                        ))}
                      </ul>

                      <Button
                        type="button"
                        className="mt-5 w-full"
                        variant={isCurrent ? "outline" : "default"}
                        disabled={isCurrent || isSelecting}
                        onClick={() => handleSelectPlan(plan)}
                      >
                        {isSelecting ? (
                          <Loader variant="button" color="white" />
                        ) : isCurrent ? (
                          "Current Plan"
                        ) : (
                          "Select Plan"
                        )}
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
