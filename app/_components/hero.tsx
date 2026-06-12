"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

const emergencyQuestions = [
  "Your medications?",
  "Your allergies?",
  "Your medical conditions?",
  "Who to contact?",
] as const

export default function Hero() {
  const router = useRouter()

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative mx-auto min-h-[32rem] max-w-7xl overflow-hidden rounded-3xl sm:min-h-[36rem] lg:min-h-[40rem]">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover object-center"
          aria-hidden
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-primary/60 mix-blend-multiply"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/75 to-primary/50"
        />

        <div className="relative z-10 flex min-h-[inherit] items-center px-8 py-12 sm:px-12 sm:py-14 md:px-16 lg:px-20">
          <div className="max-w-2xl text-left">
            <Typography
              as="h1"
              variant="h1"
              color="inherit"
              className="text-3xl leading-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
            >
              Your Medical Information. Available When It Matters Most.
            </Typography>

            <Typography
              variant="lead"
              color="inherit"
              className="mt-4 text-lg font-semibold text-primary sm:text-xl"
            >
              Secure. Portable. Accessible Anywhere.
            </Typography>

            <Typography
              variant="p"
              color="inherit"
              className="mt-5 text-base leading-relaxed text-white/90 sm:text-lg"
            >
              Imagine being in an accident while traveling, unconscious, or
              unable to speak. Would emergency providers know:
            </Typography>

            <ul className="mt-4 space-y-2">
              {emergencyQuestions.map((question) => (
                <li
                  key={question}
                  className="flex items-center gap-2.5 text-base text-white sm:text-lg"
                >
                  <span
                    aria-hidden
                    className="size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  {question}
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-4">
              <Typography
                variant="p"
                color="inherit"
                className="text-base leading-relaxed text-white/85 sm:text-lg"
              >
                Universal Health Charts provides a secure, cloud-based medical
                vault that gives you and your loved ones instant access to
                critical health information when it matters most.
              </Typography>
              <Typography
                variant="p"
                color="inherit"
                className="text-base leading-relaxed text-white/85 sm:text-lg"
              >
                Whether you&apos;re at home, traveling across the country, or
                facing an unexpected emergency, your important medical
                information is always within reach.
              </Typography>
            </div>

            <Button
              className="mt-8 bg-white text-secondary shadow-lg hover:bg-white/90"
              onClick={() => router.push("/signup")}
            >
              Join Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
