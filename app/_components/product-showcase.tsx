import {
  AlertCircle,
  HeartPulse,
  Pill,
  QrCode,
  UserRound,
} from "lucide-react"
import Image from "next/image"

import { Typography } from "@/components/ui/typography"

const profileItems = [
  { icon: Pill, label: "14 medications" },
  { icon: AlertCircle, label: "Penicillin allergy" },
  { icon: HeartPulse, label: "Type 2 diabetes" },
  { icon: UserRound, label: "Emergency contact" },
] as const

export default function ProductShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-[24rem] lg:max-w-[26rem]">
      <div
        aria-hidden
        className="absolute -inset-4 rounded-3xl bg-primary/15 blur-2xl"
      />

      <div className="relative space-y-4">
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl">
          <div className="border-b border-border/60 bg-secondary px-4 py-3">
            <Typography variant="small" className="font-semibold text-white">
              Member Dashboard
            </Typography>
            <Typography
              variant="muted"
              className="text-xs text-primary-foreground/75"
            >
              Margaret&apos;s health profile
            </Typography>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3">
            {[
              { label: "Medications", value: "14" },
              { label: "Allergies", value: "3" },
              { label: "Providers", value: "5" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-brand-primary-light/50 px-2 py-2 text-center"
              >
                <Typography variant="small" className="text-lg font-bold text-secondary">
                  {stat.value}
                </Typography>
                <Typography variant="muted" className="text-[10px] leading-tight">
                  {stat.label}
                </Typography>
              </div>
            ))}
          </div>

          <div className="space-y-2 px-3 pb-3">
            {["Lisinopril 10mg", "Metformin 500mg", "Atorvastatin 20mg"].map(
              (med) => (
                <div
                  key={med}
                  className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2"
                >
                  <Pill className="size-3.5 shrink-0 text-primary" aria-hidden />
                  <Typography variant="small" className="text-xs">
                    {med}
                  </Typography>
                </div>
              )
            )}
          </div>
        </div>

        <div className="absolute -right-2 top-16 z-10 w-[9.5rem] rotate-3 rounded-2xl border border-border/60 bg-card p-3 shadow-2xl sm:-right-6 sm:w-[10.5rem]">
          <div className="flex items-center gap-2 border-b border-border/50 pb-2">
            <QrCode className="size-4 text-primary" aria-hidden />
            <Typography variant="small" className="text-[11px] font-semibold">
              Emergency QR Card
            </Typography>
          </div>
          <div className="relative mt-2 flex aspect-square items-center justify-center rounded-lg bg-muted">
            <Image
              src="/logo-half.png"
              alt=""
              width={48}
              height={48}
              className="opacity-20"
              aria-hidden
            />
            <QrCode
              className="absolute size-16 text-secondary"
              aria-hidden
            />
          </div>
          <Typography variant="muted" className="mt-2 text-center text-[10px]">
            Scan for instant access
          </Typography>
        </div>

        <div className="absolute -left-2 bottom-0 z-10 w-[8.5rem] -rotate-6 rounded-[1.75rem] border-[3px] border-secondary bg-card p-1.5 shadow-2xl sm:-left-6 sm:w-[9.5rem]">
          <div className="overflow-hidden rounded-[1.25rem] bg-brand-primary-light/30">
            <div className="bg-secondary px-2 py-1.5">
              <Typography
                variant="small"
                className="text-[10px] font-semibold text-white"
              >
                Medical Profile
              </Typography>
            </div>
            <div className="space-y-1.5 p-2">
              {profileItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="size-3 shrink-0 text-primary" aria-hidden />
                  <Typography variant="muted" className="text-[9px] leading-tight">
                    {label}
                  </Typography>
                </div>
              ))}
            </div>
            <div className="px-2 pb-2">
              <Image
                src="/qr.jpg"
                alt="Phone displaying emergency health QR code"
                width={120}
                height={80}
                className="h-14 w-full rounded-md object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
