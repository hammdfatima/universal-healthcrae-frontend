"use client"

import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

import type { SubscriptionPlan } from "@/app/(dashboards)/admin/_lib/subscription-plans"
import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  SUBSCRIPTION_PLANS_API,
  SUBSCRIPTION_PLANS_QUERY_KEYS,
} from "@/lib/api/subscription-plans"
import { ensureCurrencyPrice } from "@/lib/subscription/format-price"
import { cn } from "@/lib/utils"

function formatBillingLabel(cycle: SubscriptionPlan["billingCycle"]) {
  return cycle === "yearly" ? "/year" : "/month"
}

export default function PricingPlans() {
  const router = useRouter()

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
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <Loader
          variant="fetch"
          label="Loading pricing plans..."
          className="py-20"
        />
      </div>
    )
  }

  if (isError && error) {
    return (
      <div className="mx-auto max-w-xl">
        <ErrorCard
          error={error}
          onRetry={() => refetch()}
          isLoading={isFetching}
        />
      </div>
    )
  }

  if (plans.length === 0) {
    return (
      <div className="mx-auto max-w-xl">
        <EmptyCard
          title="No pricing plans available"
          description="Subscription plans will appear here once they are published."
        />
      </div>
    )
  }

  return (
    <ul className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3 lg:gap-8">
      {plans.map((plan, index) => {
        const highlighted = index === 1 && plans.length > 1

        return (
          <li key={plan.id} className="flex">
            <Card
              className={cn(
                "flex w-full flex-col border-border/80",
                highlighted
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : "shadow-sm"
              )}
            >
              <CardHeader className="space-y-4 p-6 pb-0">
                {highlighted ? (
                  <span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                ) : (
                  <span className="h-6" aria-hidden />
                )}

                <div>
                  <Typography as="h3" variant="h4">
                    {plan.planName}
                  </Typography>
                  <Typography
                    variant="small"
                    color="muted"
                    className="capitalize"
                  >
                    {plan.billingCycle} billing
                  </Typography>
                </div>

                <div className="flex items-baseline gap-1">
                  <Typography as="span" variant="h2" className="text-4xl">
                    {ensureCurrencyPrice(plan.price)}
                  </Typography>
                  <Typography variant="muted" className="text-base">
                    {formatBillingLabel(plan.billingCycle)}
                  </Typography>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      <Typography variant="small" className="leading-snug">
                        {feature}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full"
                  variant={highlighted ? "default" : "outline"}
                  onClick={() => router.push("/signup")}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
