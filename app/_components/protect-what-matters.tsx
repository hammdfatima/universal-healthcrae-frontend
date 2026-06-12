import type { LucideIcon } from "lucide-react"
import {
  Check,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Plane,
  Shield,
  Users,
  UsersRound,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

const perfectFor: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: "Seniors" },
  { icon: UsersRound, label: "Families with children" },
  { icon: GraduationCap, label: "College students" },
  { icon: Plane, label: "Travelers" },
  { icon: HeartPulse, label: "Individuals with chronic health conditions" },
  {
    icon: HeartHandshake,
    label: "Caregivers managing loved ones' healthcare",
  },
]

export default function ProtectWhatMatters() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="size-6" aria-hidden />
          </div>

          <Typography as="h2" variant="h2">
            Protect What Matters Most
          </Typography>

          <Typography variant="lead" color="muted" className="mt-4">
            Universal Health Charts helps families stay prepared.
          </Typography>

          <Typography as="h3" variant="h5" className="mt-10">
            Perfect for:
          </Typography>
        </div>

        <ul className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perfectFor.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Card className="h-full border-border/80 bg-card transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-3 p-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden />
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
    </section>
  )
}
