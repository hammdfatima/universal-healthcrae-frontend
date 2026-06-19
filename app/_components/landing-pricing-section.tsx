import PricingPlans from "@/app/_components/pricing-plans"
import { Typography } from "@/components/ui/typography"

export default function LandingPricingSection() {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 border-t border-border/70 bg-brand-primary-light/20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Typography as="h2" variant="h2">
            Membership Plans
          </Typography>
          <Typography variant="lead" color="muted" className="mt-4">
            Simple, transparent pricing for individuals, couples, and families.
            Every plan includes secure storage and Emergency QR access.
          </Typography>
          <Typography variant="p" color="muted" className="mt-3 text-sm">
            Starting at less than a dollar a day — because peace of mind
            shouldn&apos;t be complicated.
          </Typography>
        </div>

        <div className="mt-12">
          <PricingPlans />
        </div>
      </div>
    </section>
  )
}
