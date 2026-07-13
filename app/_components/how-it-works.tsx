import type { LucideIcon } from "lucide-react"
import { FileUp, Globe, QrCode, Stethoscope, UserPlus } from "lucide-react"

import { Typography } from "@/components/ui/typography"

const steps: {
  step: number
  icon: LucideIcon
  title: string
  description: string
}[] = [
  {
    step: 1,
    icon: UserPlus,
    title: "Create your account",
    description:
      "Choose the plan that fits your family and set up your secure profile in minutes.",
  },
  {
    step: 2,
    icon: Stethoscope,
    title: "Add who you care about",
    description:
      "Medications, allergies, conditions, and emergency contacts for Mom, Dad, your spouse—and your pets.",
  },
  {
    step: 3,
    icon: FileUp,
    title: "Upload important documents",
    description:
      "Keep lab reports, advance directives, and other records ready when someone needs them.",
  },
  {
    step: 4,
    icon: QrCode,
    title: "Be ready in an emergency",
    description:
      "Give caregivers a way to reach critical details fast when someone can't speak for themselves.",
  },
  {
    step: 5,
    icon: Globe,
    title: "Access it when it matters",
    description:
      "From home, on the road, or at the hospital—your family's information is there when you need it.",
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-brand-primary-light/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Typography as="h2" variant="h2">
            How It Works
          </Typography>
          <Typography variant="lead" color="muted" className="mt-4">
            Set it up once for the people—and pets—you worry about. Ready when
            life gets urgent.
          </Typography>
        </div>

        <ol className="relative mt-14 space-y-8 lg:space-y-0">
          <div
            aria-hidden
            className="absolute top-8 bottom-8 left-5 hidden w-px bg-primary/20 lg:left-1/2 lg:block lg:-translate-x-px"
          />

          {steps.map((item, index) => {
            const Icon = item.icon
            const isEven = index % 2 === 0

            return (
              <li
                key={item.title}
                className="relative grid items-center gap-6 lg:grid-cols-2 lg:gap-12"
              >
                <div
                  className={
                    isEven
                      ? "lg:col-start-1 lg:row-start-1 lg:text-right"
                      : "lg:col-start-2 lg:text-left"
                  }
                >
                  <div
                    className={`flex items-start gap-4 ${isEven ? "lg:flex-row-reverse" : ""}`}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {item.step}
                    </span>
                    <div className={isEven ? "lg:text-right" : ""}>
                      <Typography as="h3" variant="h4">
                        {item.title}
                      </Typography>
                      <Typography
                        variant="p"
                        color="muted"
                        className="mt-2 text-sm leading-relaxed"
                      >
                        {item.description}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div
                  className={`hidden items-center justify-center lg:flex ${
                    isEven ? "lg:col-start-2" : "lg:col-start-1 lg:row-start-1"
                  }`}
                >
                  <span className="flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-background shadow-sm">
                    <Icon className="size-7 text-primary" aria-hidden />
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
