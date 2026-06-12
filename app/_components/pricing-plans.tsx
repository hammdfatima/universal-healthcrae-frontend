"use client"

import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

import { pricingPlans } from "@/app/_lib/pricing-plans-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

export default function PricingPlans() {
  const router = useRouter()

  return (
    <ul className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3 lg:gap-8">
      {pricingPlans.map((plan) => {
        const Icon = plan.icon

        return (
          <li key={plan.name} className="flex">
            <Card
              className={cn(
                "flex w-full flex-col border-border/80",
                plan.highlighted
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : "shadow-sm"
              )}
            >
              <CardHeader className="space-y-4 p-6 pb-0">
                {"badge" in plan && plan.badge ? (
                  <span
                    className={cn(
                      "w-fit rounded-full px-3 py-1 text-xs font-semibold",
                      plan.highlighted
                        ? "bg-primary text-primary-foreground"
                        : "bg-brand-primary-light text-secondary"
                    )}
                  >
                    {plan.badge}
                  </span>
                ) : (
                  <span className="h-6" aria-hidden />
                )}

                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <Typography as="h3" variant="h4">
                      {plan.name}
                    </Typography>
                    <Typography variant="small" color="muted">
                      {plan.members}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <Typography as="span" variant="h2" className="text-4xl">
                    {plan.price}
                  </Typography>
                  <Typography variant="muted" className="text-base">
                    /month
                  </Typography>
                </div>

                <Typography variant="p" color="muted" className="text-sm">
                  {plan.description}
                </Typography>
              </CardHeader>

              <CardContent className="flex-1 p-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      <Typography
                        variant="small"
                        className="text-sm leading-snug"
                      >
                        {feature}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
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
