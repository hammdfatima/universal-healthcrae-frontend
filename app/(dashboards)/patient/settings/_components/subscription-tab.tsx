"use client"

import { CreditCard } from "lucide-react"
import { useEffect, useState } from "react"

import {
  getSubscriptionFromStorage,
  initialSubscription,
  type SubscriptionInfo,
  saveSubscriptionToStorage,
} from "@/app/(dashboards)/patient/_lib/settings"
import ChangePlanDialog from "@/app/(dashboards)/patient/settings/_components/change-plan-dialog"
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
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

export default function SubscriptionTab() {
  const { toastSuccess } = useToast()
  const [subscription, setSubscription] =
    useState<SubscriptionInfo>(initialSubscription)
  const [planDialogOpen, setPlanDialogOpen] = useState(false)

  useEffect(() => {
    setSubscription(getSubscriptionFromStorage())
  }, [])

  function updateSubscription(next: SubscriptionInfo) {
    setSubscription(next)
    saveSubscriptionToStorage(next)
  }

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

          <Badge
            className={
              subscription.status === "active"
                ? "w-fit rounded-full bg-primary/10 text-primary hover:bg-primary/10"
                : "w-fit rounded-full bg-destructive/10 text-destructive hover:bg-destructive/10"
            }
          >
            {subscription.status === "active" ? "Active" : "Cancelled"}
          </Badge>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SubscriptionDetail label="Plan" value={subscription.planName} />
          <SubscriptionDetail
            label="Price"
            value={`${subscription.price}/mo`}
          />
          <SubscriptionDetail
            label="Billing Cycle"
            value={subscription.billingCycle}
          />
          <SubscriptionDetail
            label="Next Billing Date"
            value={subscription.nextBillingDate}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={() => setPlanDialogOpen(true)}>
            Change Plan
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">
                Cancel Subscription
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your plan will remain active until the end of the current
                  billing period. You can resubscribe at any time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    updateSubscription({
                      ...subscription,
                      status: "cancelled",
                    })
                    toastSuccess("Your subscription has been cancelled.")
                  }}
                >
                  Cancel Subscription
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <ChangePlanDialog
        open={planDialogOpen}
        onOpenChange={setPlanDialogOpen}
        currentPlanName={subscription.planName}
        onSelectPlan={updateSubscription}
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
