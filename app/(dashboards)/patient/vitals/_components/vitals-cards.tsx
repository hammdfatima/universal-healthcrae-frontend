"use client"

import type { LucideIcon } from "lucide-react"
import {
  Activity,
  Droplets,
  HeartPulse,
  Ruler,
  Scale,
  Thermometer,
  Wind,
} from "lucide-react"

import {
  formatVitalDisplay,
  type PatientVitals,
  standardVitalFields,
} from "@/app/(dashboards)/patient/_lib/vitals"
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

const vitalIcons: Record<
  (typeof standardVitalFields)[number]["key"],
  LucideIcon
> = {
  heightCm: Ruler,
  weightKg: Scale,
  bmi: Activity,
  bloodPressureSystolic: HeartPulse,
  bloodPressureDiastolic: HeartPulse,
  temperatureCelsius: Thermometer,
  heartRate: HeartPulse,
  respiratoryRate: Wind,
  totalCholesterol: Droplets,
}

type VitalsCardsProps = {
  vitals: PatientVitals
}

export default function VitalsCards({ vitals }: VitalsCardsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {standardVitalFields.map((field) => {
          const Icon = vitalIcons[field.key]
          const value = vitals[field.key]

          return (
            <Card
              key={field.key}
              className="border-border/60 shadow-sm transition-colors hover:border-primary/20"
            >
              <CardContent className="flex items-start gap-4 p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <Typography variant="muted" className="text-sm">
                    {field.label}
                  </Typography>
                  <Typography
                    as="p"
                    variant="h4"
                    className="mt-1 leading-tight"
                  >
                    {formatVitalDisplay(
                      value,
                      "unit" in field ? field.unit : undefined
                    )}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {vitals.customFields.length > 0 ? (
        <div className="space-y-3">
          <Typography variant="small" className="font-semibold">
            Additional Vitals
          </Typography>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {vitals.customFields.map((field) => (
              <Card
                key={field.id}
                className="border-border/60 shadow-sm transition-colors hover:border-primary/20"
              >
                <CardContent className="p-5">
                  <Typography variant="muted" className="text-sm">
                    {field.fieldName}
                  </Typography>
                  <Typography
                    as="p"
                    variant="h4"
                    className="mt-1 leading-tight"
                  >
                    {formatVitalDisplay(field.value)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
