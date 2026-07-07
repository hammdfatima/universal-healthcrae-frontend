"use client"

import { AlertTriangle } from "lucide-react"
import { use } from "react"

import EmergencyRecordsView from "@/app/(dashboards)/patient/_components/emergency-records-view"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  EMERGENCY_ACCESS_API,
  EMERGENCY_ACCESS_QUERY_KEYS,
  type PublicEmergencyRecords,
} from "@/lib/api/emergency-access"

type EmergencyAccessPageProps = {
  params: Promise<{ token: string }>
}

export default function EmergencyAccessPage({
  params,
}: EmergencyAccessPageProps) {
  const { token } = use(params)

  const recordsQuery = useFetch<PublicEmergencyRecords>({
    path: EMERGENCY_ACCESS_API.publicRecords(token),
    queryKey: EMERGENCY_ACCESS_QUERY_KEYS.publicRecords(token),
    retry: false,
  })

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-8 sm:px-6 sm:pb-10 sm:pt-10">
      <div className="mb-8">
        <Typography variant="h2">Emergency Medical Records</Typography>
        {!recordsQuery.isLoading &&
          (recordsQuery.isError || !recordsQuery.data ? (
            <Typography variant="muted" className="mt-2">
              Unable to load emergency medical records.
            </Typography>
          ) : (
            <Typography variant="muted" className="mt-2">
              Authorized emergency access for {recordsQuery.data.patientName}.
            </Typography>
          ))}
      </div>

      {recordsQuery.isLoading ? (
        <Loader
          variant="fetch"
          label="Loading emergency medical records..."
          className="min-h-[50vh] py-16"
        />
      ) : recordsQuery.isError || !recordsQuery.data ? (
        <div className="rounded-2xl border border-border/60 bg-muted/20 px-6 py-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-7 text-destructive" aria-hidden />
          </div>
          <Typography variant="h3" className="mt-6">
            Emergency access unavailable
          </Typography>
          <Typography variant="muted" className="mt-2">
            This link is invalid, expired, or has been revoked by the patient.
          </Typography>
        </div>
      ) : (
        <EmergencyRecordsView records={recordsQuery.data} />
      )}
    </div>
  )
}
