import {
  FileText,
  HeartPulse,
  PawPrint,
  Printer,
  ShieldCheck,
  Syringe,
} from "lucide-react"
import type { Metadata, Route } from "next"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

export const metadata: Metadata = {
  title: "Pet Profiles | Universal Health Charts",
  description:
    "Protect the pets you love by keeping their veterinary information ready when it matters most.",
}

const benefits = [
  {
    icon: Syringe,
    title: "Vaccination & medical history",
    description:
      "Keep vaccination records, medications, allergies, and conditions organized so any veterinarian can act quickly.",
  },
  {
    icon: HeartPulse,
    title: "Emergency-ready contacts",
    description:
      "Keep your veterinarian, emergency clinic, and family emergency contacts ready anytime you need them.",
  },
  {
    icon: ShieldCheck,
    title: "Secure household account",
    description:
      "Pets belong in your family membership—the same account that protects the people you love.",
  },
  {
    icon: Printer,
    title: "Emergency Pet Summary",
    description:
      "Generate a one-page summary that's easy to view, print, or share with an emergency veterinary clinic.",
  },
  {
    icon: FileText,
    title: "Veterinary documents",
    description:
      "Keep notes and key veterinary details together with microchip numbers, weight, breed, and age.",
  },
  {
    icon: PawPrint,
    title: "Built for pet parents",
    description:
      "Because your dog or cat is family too—peace of mind shouldn't stop at the front door.",
  },
] as const

const profileFields = [
  "Pet photo",
  "Name, species & breed",
  "Age & weight",
  "Microchip number",
  "Veterinarian",
  "Emergency veterinary clinic",
  "Vaccination history",
  "Current medications",
  "Allergies & conditions",
  "Emergency contacts",
  "Veterinary documents & notes",
] as const

export default function PetProfilesPage() {
  return (
    <>
      <section className="border-b border-border/70 bg-brand-primary-light/40 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Typography as="h1" variant="h1">
            Your pets deserve the same peace of mind
          </Typography>
          <Typography variant="lead" color="muted" className="mt-4">
            Protect the pets you love by keeping their vaccinations,
            medications, allergies, emergency contacts, and medical history
            ready when it matters most.
          </Typography>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Create a Pet Profile</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={"/#pricing" as Route}>View Membership Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <Typography as="h2" variant="h2">
              Why keep pet health information ready?
            </Typography>
            <Typography variant="lead" color="muted" className="mt-4">
              Emergencies don&apos;t wait for you to find a folder. A Pet
              Profile keeps critical details ready for you—and for the
              veterinarian who needs them.
            </Typography>
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <li key={title}>
                <Card className="h-full border-border/80 bg-card shadow-sm">
                  <CardContent className="p-6">
                    <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <Typography as="h3" variant="h5" className="mt-4">
                      {title}
                    </Typography>
                    <Typography variant="muted" className="mt-2 text-sm">
                      {description}
                    </Typography>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-brand-primary-light/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative min-h-[18rem] overflow-hidden rounded-3xl sm:min-h-[22rem]">
            <Image
              src="/pet1.jpg"
              alt="Happy dog outdoors"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div>
            <Typography as="h2" variant="h2">
              Everything in a Pet Profile
            </Typography>
            <Typography variant="p" color="muted" className="mt-4">
              Set up a Pet Profile once so the details that protect your pet are
              ready when it matters most. In an emergency, generate a one-page
              Emergency Pet Summary to view, print, or share.
            </Typography>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {profileFields.map((field) => (
                <li
                  key={field}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                  {field}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-primary/10 bg-secondary">
            <div className="grid items-stretch lg:grid-cols-2">
              <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
                <Typography
                  as="h2"
                  variant="h2"
                  color="inherit"
                  className="text-white"
                >
                  Emergency Pet Summary
                </Typography>
                <Typography
                  variant="p"
                  color="inherit"
                  className="mt-4 text-white/85"
                >
                  Automatically generate a one-page summary with the most
                  important medical information for emergency veterinary
                  care—easy to view, print, or share when every minute counts.
                </Typography>
                <div className="mt-8">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-secondary hover:bg-white/90"
                  >
                    <Link href="/signup">Protect Your Pets</Link>
                  </Button>
                </div>
              </div>
              <div className="relative min-h-[16rem] sm:min-h-[20rem]">
                <Image
                  src="/pet2.jpg"
                  alt="Cat resting calmly"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
