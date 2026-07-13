"use client"

import { PawPrint } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function FamilyIncludesPets() {
  const router = useRouter()

  return (
    <section className="px-4 py-6 lg:pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl border border-primary/10 bg-brand-primary-light/40">
          <div className="grid items-stretch lg:grid-cols-2">
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-1.5">
                <PawPrint className="size-4 text-primary" aria-hidden />
                <Typography variant="small" color="secondary">
                  Pets are family too
                </Typography>
              </div>

              <Typography as="h2" variant="h2" className="mt-5">
                Because Family Includes Pets
              </Typography>

              <Typography
                variant="lead"
                color="muted"
                className="mt-4 max-w-md text-base leading-relaxed sm:text-lg"
              >
                Store veterinary records, vaccinations, medications, allergies,
                and emergency contacts for your pets in the same secure family
                account.
              </Typography>

              <div className="mt-8">
                <Button size="lg" onClick={() => router.push("/about")}>
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative min-h-[18rem] sm:min-h-[22rem] lg:min-h-full">
              <Image
                src="/pets.webp"
                alt="Dog and kitten resting together in a pet bed"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
