"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

import ProductShowcase from "@/app/_components/product-showcase"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function Hero() {
  const router = useRouter()

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
        <div className="relative min-h-[36rem]">
          <Image
            src="/hero.jpeg"
            alt="Family member caring for a loved one at home"
            fill
            priority
            quality={100}
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center brightness-[1.04] contrast-[1.06] saturate-[1.05]"
          />

          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-secondary/72 via-secondary/58 to-secondary/20 lg:from-secondary/68 lg:via-secondary/50 lg:to-secondary/10"
          />

          <div className="relative z-10 grid min-h-[inherit] items-center gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-14 lg:py-16">
            <div className="max-w-xl text-left">
              <Typography
                as="h1"
                variant="h1"
                color="inherit"
                className="text-3xl leading-tight text-white sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]"
              >
                Protect What Matters Most.
              </Typography>

              <Typography
                variant="lead"
                color="inherit"
                className="mt-5 text-base leading-relaxed text-white/90 sm:text-lg"
              >
                Securely organize important medical information for your
                family—and even your pets—all in one place.
              </Typography>

              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-white text-secondary shadow-lg hover:bg-white/90"
                  onClick={() => router.push("/signup")}
                >
                  Get Started
                </Button>
              </div>

              <Typography
                variant="muted"
                color="inherit"
                className="mt-6 text-sm text-white/75"
              >
                Because when something happens, you shouldn&apos;t have to hunt
                for Mom&apos;s meds, Dad&apos;s allergies, or your dog&apos;s
                vaccine records.
              </Typography>
            </div>

            <div className="flex justify-center lg:justify-end">
              <ProductShowcase />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
