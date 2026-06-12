import type { LucideIcon } from "lucide-react"
import {
  AlertCircle,
  Check,
  FileCheck,
  FileText,
  HeartPulse,
  Pill,
  UserRound,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

const storeItems: { icon: LucideIcon; label: string }[] = [
  { icon: Pill, label: "Current medications" },
  { icon: AlertCircle, label: "Allergies and reactions" },
  { icon: HeartPulse, label: "Medical conditions" },
  { icon: UserRound, label: "Emergency contacts" },
  { icon: FileText, label: "Lab reports and medical documents" },
  { icon: FileCheck, label: "Advance directives and healthcare documents" },
]

export default function WhyUniversal() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Typography as="h2" variant="h2">
            Why Universal Health Charts?
          </Typography>
          <Typography variant="lead" color="muted" className="mt-4">
            Healthcare information is often scattered across multiple providers,
            hospital systems, and patient portals.
          </Typography>
          <Typography variant="p" color="muted" className="mt-3">
            Universal Health Charts brings everything together in one secure
            location.
          </Typography>
        </div>

        <div className="mt-14">
          <Typography as="h3" variant="h3" className="text-center">
            Store Important Medical Information
          </Typography>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {storeItems.map(({ icon: Icon, label }) => (
              <li key={label}>
                <Card className="h-full border-border/80 bg-card transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <Typography
                      variant="small"
                      className="min-w-0 flex-1 text-base leading-snug"
                    >
                      {label}
                    </Typography>
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    </span>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
