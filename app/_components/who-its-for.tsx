import type { LucideIcon } from "lucide-react"
import {
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  PawPrint,
  Plane,
  Users,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

const audiences: { icon: LucideIcon; label: string; description: string }[] = [
  {
    icon: HeartHandshake,
    label: "Caregivers",
    description:
      "Daughters, sons, and spouses managing care for aging parents or partners.",
  },
  {
    icon: Users,
    label: "Families",
    description:
      "Households who want everyone they love prepared—with health details ready when something unexpected happens.",
  },
  {
    icon: PawPrint,
    label: "Pet Parents",
    description:
      "People who protect their dog or cat as part of the family, not as an afterthought.",
  },
  {
    icon: Plane,
    label: "Travelers",
    description:
      "People who need important health information ready wherever life takes them.",
  },
  {
    icon: GraduationCap,
    label: "College Families",
    description:
      "Parents of young adults away from home who still need to share health details quickly.",
  },
  {
    icon: HeartPulse,
    label: "Chronic Conditions",
    description:
      "Anyone with ongoing medications, allergies, or conditions that must be known quickly.",
  },
]

export default function WhoItsFor() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Typography as="h2" variant="h2">
            Who It&apos;s For
          </Typography>
          <Typography variant="lead" color="muted" className="mt-4">
            Built for real families facing real moments — a preparedness
            platform for the people and pets you love.
          </Typography>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map(({ icon: Icon, label, description }) => (
            <li key={label}>
              <Card className="h-full border-border/80 bg-card transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <Typography as="h3" variant="h4" className="mt-4">
                    {label}
                  </Typography>
                  <Typography
                    variant="p"
                    color="muted"
                    className="mt-2 text-sm"
                  >
                    {description}
                  </Typography>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
