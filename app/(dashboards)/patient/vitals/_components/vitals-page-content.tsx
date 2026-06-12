"use client"

import { CalendarClock, HeartPulse, Pencil } from "lucide-react"
import { useEffect, useState } from "react"

import {
  getVitalsFromStorage,
  initialVitals,
  type PatientVitals,
} from "@/app/(dashboards)/patient/_lib/vitals"
import UpdateVitalsDialog from "@/app/(dashboards)/patient/vitals/_components/update-vitals-dialog"
import VitalsCards from "@/app/(dashboards)/patient/vitals/_components/vitals-cards"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

export default function VitalsPageContent() {
  const [vitals, setVitals] = useState<PatientVitals>(initialVitals)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    setVitals(getVitalsFromStorage())
  }, [])

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HeartPulse className="size-6" aria-hidden />
          </span>
          <div>
            <Typography as="h1" variant="h3">
              Vital Signs
            </Typography>
            <Typography variant="muted" className="mt-1">
              Your current health measurements in one place.
            </Typography>
          </div>
        </div>

        <Button
          className="gap-1.5 self-start"
          onClick={() => setDialogOpen(true)}
        >
          <Pencil className="size-4" aria-hidden />
          Update Vitals
        </Button>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <CalendarClock className="size-4" aria-hidden />
            </span>
            <div>
              <Typography variant="muted" className="text-xs">
                Added on
              </Typography>
              <Typography variant="small" className="font-medium">
                {vitals.addedOn || "—"}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <CalendarClock className="size-4" aria-hidden />
            </span>
            <div>
              <Typography variant="muted" className="text-xs">
                Updated on
              </Typography>
              <Typography variant="small" className="font-medium">
                {vitals.updatedOn || "—"}
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      <VitalsCards vitals={vitals} />

      <UpdateVitalsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vitals={vitals}
        onSaved={setVitals}
      />
    </div>
  )
}
