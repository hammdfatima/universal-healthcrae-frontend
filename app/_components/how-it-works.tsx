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
    title: "Enter medical information",
    description:
      "Add medications, allergies, conditions, and emergency contacts for each family member.",
  },
  {
    step: 3,
    icon: FileUp,
    title: "Upload important documents",
    description:
      "Store lab reports, advance directives, and other health documents in one place.",
  },
  {
    step: 4,
    icon: QrCode,
    title: "Receive your QR Emergency Card",
    description:
      "Every member gets a unique QR code so caregivers can access critical details instantly.",
  },
  {
    step: 5,
    icon: Globe,
    title: "Access your information anywhere",
    description:
      "View and update your family's health information from home, on the road, or in an emergency.",
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-brand-primary-light/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Typography as="h2" variant="h2">
            How Universal Health Charts Works
          </Typography>
          <Typography variant="lead" color="muted" className="mt-4">
            Your family&apos;s secure medical information center — set up once,
            ready whenever you need it.
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
