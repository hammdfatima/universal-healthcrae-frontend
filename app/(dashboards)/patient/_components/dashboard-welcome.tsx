"use client"

import { FileText } from "lucide-react"
import { useState } from "react"

import ReviewRecordsDialog from "@/app/(dashboards)/patient/_components/review-records-dialog"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  PATIENT_PROFILE_API,
  PATIENT_PROFILE_QUERY_KEYS,
  type PatientProfileResponse,
} from "@/lib/api/patient-profile"

export default function DashboardWelcome() {
  const [recordsOpen, setRecordsOpen] = useState(false)

  const { data: profile, isLoading } = useFetch<PatientProfileResponse>({
    path: PATIENT_PROFILE_API.get,
    queryKey: PATIENT_PROFILE_QUERY_KEYS.profile,
  })

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const firstName = profile?.firstName?.trim() || "there"

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary to-primary px-6 py-8 text-secondary-foreground shadow-lg sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-primary/30 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {isLoading ? (
              <Loader
                variant="fetch"
                color="white"
                label="Loading profile..."
                className="justify-start py-2"
              />
            ) : (
              <Typography
                as="h1"
                variant="h3"
                color="inherit"
                className="text-secondary-foreground"
              >
                Welcome back, {firstName}
              </Typography>
            )}
            <Typography
              variant="muted"
              color="inherit"
              className="mt-2 max-w-xl text-secondary-foreground/80"
            >
              Track medications, allergies, immunizations, and your complete
              medical vault in one secure place.
            </Typography>
            <Button
              type="button"
              variant="secondary"
              className="mt-5 gap-1.5 bg-white text-secondary hover:bg-white/90"
              onClick={() => setRecordsOpen(true)}
            >
              <FileText className="size-4" aria-hidden />
              Review Records
            </Button>
          </div>
          <Typography
            variant="small"
            color="inherit"
            className="shrink-0 rounded-full bg-white/15 px-4 py-2 text-secondary-foreground/90 backdrop-blur-sm"
          >
            {today}
          </Typography>
        </div>
      </section>

      <ReviewRecordsDialog open={recordsOpen} onOpenChange={setRecordsOpen} />
    </>
  )
}
