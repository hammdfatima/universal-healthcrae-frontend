import {
  Building2,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Plane,
  Shield,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

const scenarios = [
  {
    icon: Building2,
    question: "Mom is hospitalized?",
    detail:
      "Doctors need her medications and allergies immediately — not scattered across old paperwork.",
  },
  {
    icon: HeartHandshake,
    question: "Your spouse can't communicate?",
    detail:
      "In an emergency, caregivers need accurate health details without guessing.",
  },
  {
    icon: GraduationCap,
    question: "Your child is away at college?",
    detail:
      "Make sure their medical history is available even when you're hundreds of miles away.",
  },
  {
    icon: Plane,
    question: "You're traveling out of state?",
    detail:
      "Your health information should travel with you — not stay locked in a filing cabinet.",
  },
] as const

export default function AreYouPrepared() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Typography as="h2" variant="h2">
            Are You Prepared?
          </Typography>
          <Typography variant="lead" color="muted" className="mt-4">
            What if something unexpected happens and the people who need your
            family&apos;s medical history can&apos;t find it in time?
          </Typography>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {scenarios.map(({ icon: Icon, question, detail }) => (
            <li key={question}>
              <Card className="h-full border-border/80 bg-card transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <Typography as="h3" variant="h4" className="mt-4">
                    {question}
                  </Typography>
                  <Typography variant="p" color="muted" className="mt-2 text-sm">
                    {detail}
                  </Typography>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-primary/15 bg-brand-primary-light/40 px-6 py-5 text-center">
          <Typography variant="p" className="text-base leading-relaxed">
            For less than a dollar a day, you can make sure your loved
            one&apos;s important medical information is available when something
            unexpected happens.
          </Typography>
        </div>
      </div>
    </section>
  )
}
