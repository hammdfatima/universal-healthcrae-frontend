"use client"

import { format, parseISO } from "date-fns"
import { ArrowLeft, Check } from "lucide-react"
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
  type ChangePlanPreview,
  type ChangePlanResponse,
  SUBSCRIPTIONS_API,
} from "@/lib/api/subscriptions"
import { ensureCurrencyPrice } from "@/lib/subscription/format-price"
import { cn } from "@/lib/utils"

type ChangePlanDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlanId: string | null
  cancelAtPeriodEnd?: boolean
  scheduledPlanId?: string | null
  onPlanChanged: () => void
}

function formatBillingLabel(cycle: SubscriptionPlan["billingCycle"]) {
  return cycle === "yearly" ? "/year" : "/month"
}

function formatEffectiveDate(value: string | null) {
  if (!value) return null

  try {
    return format(parseISO(value), "MMM d, yyyy")
  } catch {
    return null
  }
}

function changeTypeLabel(changeType: ChangePlanPreview["changeType"]) {
  switch (changeType) {
    case "upgrade":
      return "Upgrade"
    case "downgrade":
      return "Downgrade"
    case "reactivate":
      return "Reactivate"
    default:
      return "New subscription"
  }
}

export default function ChangePlanDialog({
  open,
  onOpenChange,
  currentPlanId,
  cancelAtPeriodEnd = false,
  scheduledPlanId = null,
  onPlanChanged,
}: ChangePlanDialogProps) {
  const [selectingPlanId, setSelectingPlanId] = useState<string | null>(null)
  const [preview, setPreview] = useState<ChangePlanPreview | null>(null)
  const [confirming, setConfirming] = useState(false)

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

  const { onRequest: previewPlanChange } = useApi<{ planId: string }>({
    key: "preview-subscription-plan",
    method: "post",
    showSuccessToast: false,
  })

  const { onRequest: changePlan } = useApi<{ planId: string }>({
    key: "change-subscription-plan",
    method: "post",
  })

  function resetState() {
    setSelectingPlanId(null)
    setPreview(null)
    setConfirming(false)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetState()
    }
    onOpenChange(nextOpen)
  }

  function handleSelectPlan(plan: SubscriptionPlan) {
    setSelectingPlanId(plan.id)

    previewPlanChange({
      path: SUBSCRIPTIONS_API.changePlanPreview,
      data: { planId: plan.id },
      onSuccess: (result: ChangePlanPreview) => {
        setPreview(result)
        setSelectingPlanId(null)
      },
      onError: () => {
        setSelectingPlanId(null)
      },
    })
  }

  function handleConfirmChange() {
    if (!preview) return

    setConfirming(true)

    changePlan({
      path: SUBSCRIPTIONS_API.changePlan,
      data: { planId: preview.targetPlan.id },
      onSuccess: (result: ChangePlanResponse) => {
        if (result.mode === "checkout") {
          window.location.href = result.checkoutUrl
          return
        }

        onPlanChanged()
        handleOpenChange(false)
      },
      onError: () => {
        setConfirming(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
          <DialogTitle>
            {preview ? "Confirm plan change" : "Change Plan"}
          </DialogTitle>
          <DialogDescription>
            {preview
              ? "Review the billing impact before confirming."
              : "Choose the plan that best fits your household."}
          </DialogDescription>
        </DialogHeader>

        <div className="thin-scrollbar overflow-y-auto px-6 py-5">
          {preview ? (
            <div className="mx-auto max-w-xl space-y-5">
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <Typography variant="small" className="font-semibold">
                    {preview.targetPlan.planName}
                  </Typography>
                  <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                    {changeTypeLabel(preview.changeType)}
                  </Badge>
                </div>

                <Typography variant="muted" className="mt-2 text-sm">
                  {preview.summary}
                </Typography>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/50 bg-background px-4 py-3">
                    <Typography variant="muted" className="text-xs">
                      Due today
                    </Typography>
                    <Typography variant="small" className="mt-1 font-semibold">
                      {preview.amountDueCents > 0
                        ? preview.amountDueFormatted
                        : "$0.00"}
                    </Typography>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-background px-4 py-3">
                    <Typography variant="muted" className="text-xs">
                      {preview.mode === "scheduled"
                        ? "Takes effect"
                        : "New plan price"}
                    </Typography>
                    <Typography variant="small" className="mt-1 font-semibold">
                      {preview.mode === "scheduled"
                        ? (formatEffectiveDate(preview.effectiveAt) ??
                          "End of period")
                        : `${ensureCurrencyPrice(preview.targetPlan.price)}${formatBillingLabel(preview.targetPlan.billingCycle)}`}
                    </Typography>
                  </div>
                </div>

                {preview.creditCents > 0 && preview.creditFormatted ? (
                  <Typography variant="muted" className="mt-3 text-xs">
                    Unused-time credit of {preview.creditFormatted} will apply
                    to a future invoice.
                  </Typography>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="sm:w-auto"
                  disabled={confirming}
                  onClick={() => setPreview(null)}
                >
                  <ArrowLeft className="mr-2 size-4" aria-hidden />
                  Back
                </Button>
                <Button
                  type="button"
                  className="sm:flex-1"
                  disabled={confirming}
                  onClick={handleConfirmChange}
                >
                  {confirming ? (
                    <Loader variant="button" color="white" />
                  ) : preview.mode === "checkout" ? (
                    "Continue to Checkout"
                  ) : preview.mode === "scheduled" ? (
                    "Schedule Downgrade"
                  ) : preview.amountDueCents > 0 ? (
                    `Confirm & Pay ${preview.amountDueFormatted}`
                  ) : (
                    "Confirm Change"
                  )}
                </Button>
              </div>
            </div>
          ) : null}

          {!preview && isLoading ? (
            <Loader
              variant="fetch"
              label="Loading plans..."
              className="py-16"
            />
          ) : null}

          {!preview && isError && error ? (
            <ErrorCard
              error={error}
              onRetry={() => refetch()}
              isLoading={isFetching}
            />
          ) : null}

          {!preview && !isLoading && !isError && plans.length === 0 ? (
            <EmptyCard
              title="No plans available"
              description="Subscription plans are not available right now."
            />
          ) : null}

          {!preview && !isLoading && !isError && plans.length > 0 ? (
            <ul className="grid gap-4 lg:grid-cols-3">
              {plans.map((plan, index) => {
                const highlighted = index === 1 && plans.length > 1
                const isCurrent =
                  plan.id === currentPlanId && !cancelAtPeriodEnd
                const isScheduled = plan.id === scheduledPlanId
                const canReactivate =
                  plan.id === currentPlanId && cancelAtPeriodEnd
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
                        {isScheduled ? (
                          <Badge className="rounded-full bg-amber-500/10 text-amber-700 hover:bg-amber-500/10">
                            Scheduled
                          </Badge>
                        ) : highlighted ? (
                          <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                            Popular
                          </Badge>
                        ) : null}
                      </div>

                      <div className="flex items-baseline gap-1">
                        <Typography as="span" variant="h3">
                          {ensureCurrencyPrice(plan.price)}
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
                        variant={
                          isCurrent || isScheduled ? "outline" : "default"
                        }
                        disabled={
                          (isCurrent && !scheduledPlanId) ||
                          isScheduled ||
                          isSelecting
                        }
                        onClick={() => handleSelectPlan(plan)}
                      >
                        {isSelecting ? (
                          <Loader variant="button" color="white" />
                        ) : isScheduled ? (
                          "Already Scheduled"
                        ) : isCurrent && scheduledPlanId ? (
                          "Keep This Plan"
                        ) : isCurrent ? (
                          "Current Plan"
                        ) : canReactivate ? (
                          "Keep This Plan"
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
