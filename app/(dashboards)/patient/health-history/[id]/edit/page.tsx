"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"
import {
  formValuesToPayload,
  type HealthHistoryFormValues,
  healthHistoryToFormValues,
} from "@/app/(dashboards)/patient/_lib/health-history"
import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import HealthHistoryForm from "@/app/(dashboards)/patient/health-history/_components/health-history-form"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  HEALTH_HISTORY_API,
  HEALTH_HISTORY_QUERY_KEYS,
  type HealthHistoryListResponse,
  type UpdateHealthHistoryPayload,
} from "@/lib/api/health-history"

export default function EditHealthHistoryPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useFetch<HealthHistoryListResponse>({
    path: HEALTH_HISTORY_API.list,
    queryKey: HEALTH_HISTORY_QUERY_KEYS.list,
  })

  const entry = useMemo(
    () => data?.entries.find((item) => item.id === params.id) ?? null,
    [data?.entries, params.id]
  )

  const { onRequest: updateHealthHistoryEntry, isPending } =
    useApi<UpdateHealthHistoryPayload>({
      key: "update-health-history-entry",
      method: "patch",
    })

  function handleSubmit(values: HealthHistoryFormValues) {
    if (!entry) return

    updateHealthHistoryEntry({
      path: HEALTH_HISTORY_API.update(entry.id),
      data: formValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: HEALTH_HISTORY_QUERY_KEYS.list,
        })
        router.push(healthRecordHref("health-history"))
      },
    })
  }

  if (isLoading) {
    return <Loader variant="full-page" label="Loading diagnosis..." />
  }

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Diagnosis not found</Typography>
        <Typography variant="muted" className="mt-2">
          This health history entry may have been removed or the link is
          invalid.
        </Typography>
      </div>
    )
  }

  return (
    <HealthHistoryForm
      key={entry.id}
      title="Edit Diagnosis"
      description={`Update details for ${entry.illnessName}.`}
      defaultValues={healthHistoryToFormValues(entry)}
      submitLabel="Save Changes"
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
