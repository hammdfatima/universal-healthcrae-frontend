import { Cloud, Lock, ShieldCheck } from "lucide-react"
import type { Metadata } from "next"

import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

export const metadata: Metadata = {
  title: "About | Universal Health Charts",
  description:
    "Learn how Universal Health Charts helps you securely store and manage your healthcare information.",
}

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: "Modern security practices",
    description:
      "Industry-standard safeguards help protect your sensitive health data at every step.",
  },
  {
    icon: Lock,
    title: "Encrypted cloud storage",
    description:
      "Your information is stored using encrypted cloud storage designed for healthcare privacy.",
  },
  {
    icon: Cloud,
    title: "Privacy-first platform",
    description:
      "We take privacy seriously and are committed to a secure platform for your healthcare information.",
  },
] as const

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border/70 bg-brand-primary-light/40 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Typography as="h1" variant="h1">
            About Universal Health Charts
          </Typography>
          <Typography variant="lead" color="muted" className="mt-4">
            A secure personal health record platform that gives you ownership of
            your medical data — accessible when it matters most.
          </Typography>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Typography as="h2" variant="h2">
            Our Mission
          </Typography>
          <Typography variant="p" color="muted" className="mt-4">
            Universal Health Charts was built to solve a simple but critical
            problem: healthcare information is scattered across providers,
            hospitals, and patient portals. We bring everything together in one
            secure medical vault — so you and your loved ones can access
            medications, allergies, conditions, and emergency contacts anytime,
            anywhere.
          </Typography>
          <Typography variant="p" color="muted" className="mt-4">
            Whether you&apos;re at home, traveling, or facing an unexpected
            emergency, your important medical information stays within reach
            through secure cloud access and Emergency QR codes.
          </Typography>
        </div>
      </section>

      <section className="bg-brand-primary-light/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <Typography as="h2" variant="h2">
              Secure Cloud-Based Protection
            </Typography>
            <Typography variant="lead" color="muted" className="mt-4">
              Your information is protected using modern security practices and
              encrypted cloud storage.
            </Typography>
            <Typography variant="p" color="muted" className="mt-4">
              We take privacy seriously and are committed to providing a secure
              platform for managing your healthcare information.
            </Typography>
          </div>

          <ul className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {securityFeatures.map(({ icon: Icon, title, description }) => (
              <li key={title}>
                <Card className="h-full border-border/80 bg-background shadow-sm">
                  <CardContent className="p-6">
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <Typography as="h3" variant="h5" className="mt-4">
                      {title}
                    </Typography>
                    <Typography variant="muted" className="mt-2">
                      {description}
                    </Typography>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
