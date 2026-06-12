import type { LucideIcon } from "lucide-react"
import {
  AlertCircle,
  Clock,
  HeartPulse,
  Pill,
  QrCode,
  UserRound,
} from "lucide-react"
import Image from "next/image"

import { Typography } from "@/components/ui/typography"

const criticalInfo: { icon: LucideIcon; label: string }[] = [
  { icon: AlertCircle, label: "Allergies" },
  { icon: Pill, label: "Medications" },
  { icon: UserRound, label: "Emergency Contacts" },
  { icon: HeartPulse, label: "Important Medical Conditions" },
]

export default function EmergencyQrAccess() {
  return (
    <section className="px-4 py-6 sm:px-6  lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-primary/10 bg-brand-primary-light/40 px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-1.5">
                <QrCode className="size-4 text-primary" aria-hidden />
                <Typography variant="small" color="secondary">
                  Instant emergency access
                </Typography>
              </div>

              <Typography as="h2" variant="h2" className="mt-5">
                Emergency QR Access
              </Typography>

              <Typography variant="lead" color="muted" className="mt-4">
                Every member receives a unique Emergency Access QR Code.
              </Typography>

              <Typography variant="p" color="muted" className="mt-3">
                In an emergency, authorized caregivers, family members, or
                healthcare professionals can quickly view critical information
                including:
              </Typography>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {criticalInfo.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 rounded-full border border-border/80 bg-background px-4 py-3 shadow-sm"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <Typography
                      variant="small"
                      className="text-sm leading-snug sm:text-base"
                    >
                      {label}
                    </Typography>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-start gap-3 border-t border-primary/10 pt-8">
                <Clock
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden
                />
                <Typography variant="p" color="muted">
                  Fast access to accurate information can make a difference when
                  every minute counts.
                </Typography>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[17rem] sm:max-w-[19rem] lg:max-w-[21rem]">
                <div
                  aria-hidden
                  className="absolute -inset-3 rounded-2xl bg-primary/15 blur-xl"
                />
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background shadow-lg">
                  <Image
                    src="/qr.jpg"
                    alt="People presenting emergency health QR codes on their phones"
                    width={420}
                    height={520}
                    className="aspect-[4/5] w-full object-cover object-top"
                    sizes="(max-width: 640px) 272px, (max-width: 1024px) 304px, 336px"
                  />
                </div>
                <Typography
                  variant="muted"
                  className="mt-4 text-center text-sm"
                >
                  Scan to view critical health details instantly.
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
