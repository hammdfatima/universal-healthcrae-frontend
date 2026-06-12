import type { Metadata } from "next"

import PricingPlans from "@/app/_components/pricing-plans"
import { Typography } from "@/components/ui/typography"

export const metadata: Metadata = {
  title: "Pricing | Universal Health Charts",
  description:
    "Choose the right Universal Health Charts plan — Individual, Couple, or Family — starting at $9.95/month.",
}

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-border/70 bg-brand-primary-light/40 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Typography as="h1" variant="h1">
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="lead" color="muted" className="mt-4">
            Choose the plan that fits your life. Every plan includes secure
            medical record storage and Emergency QR access.
          </Typography>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <PricingPlans />
      </section>
    </>
  )
}
