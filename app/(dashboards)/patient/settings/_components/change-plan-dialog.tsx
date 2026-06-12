"use client"

import { Check } from "lucide-react"

import { pricingPlans } from "@/app/_lib/pricing-plans-data"
import type { SubscriptionInfo } from "@/app/(dashboards)/patient/_lib/settings"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type ChangePlanDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlanName: string
  onSelectPlan: (plan: SubscriptionInfo) => void
}

export default function ChangePlanDialog({
  open,
  onOpenChange,
  currentPlanName,
  onSelectPlan,
}: ChangePlanDialogProps) {
  const { toastSuccess } = useToast()

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
          <ul className="grid gap-4 lg:grid-cols-3">
            {pricingPlans.map((plan) => {
              const Icon = plan.icon
              const isCurrent = plan.name === currentPlanName

              return (
                <li key={plan.name}>
                  <div
                    className={cn(
                      "flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm",
                      plan.highlighted
                        ? "border-primary ring-2 ring-primary/15"
                        : "border-border/60",
                      isCurrent && "border-secondary ring-2 ring-secondary/20"
                    )}
                  >
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="size-5" aria-hidden />
                        </span>
                        <div>
                          <Typography variant="small" className="font-semibold">
                            {plan.name}
                          </Typography>
                          <Typography variant="muted" className="text-xs">
                            {plan.members}
                          </Typography>
                        </div>
                      </div>
                      {"badge" in plan && plan.badge ? (
                        <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                          {plan.badge}
                        </Badge>
                      ) : null}
                    </div>

                    <div className="flex items-baseline gap-1">
                      <Typography as="span" variant="h3">
                        {plan.price}
                      </Typography>
                      <Typography variant="muted" className="text-sm">
                        /month
                      </Typography>
                    </div>

                    <Typography variant="muted" className="mt-2 text-sm">
                      {plan.description}
                    </Typography>

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
                      disabled={isCurrent}
                      onClick={() => {
                        onSelectPlan({
                          planName: plan.name,
                          price: plan.price,
                          billingCycle: "Monthly",
                          nextBillingDate: "Jul 12, 2026",
                          status: "active",
                        })
                        onOpenChange(false)
                        toastSuccess(`Your plan has been updated to ${plan.name}.`)
                      }}
                    >
                      {isCurrent ? "Current Plan" : "Select Plan"}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
