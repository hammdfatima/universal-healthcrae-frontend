"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import {
  formValuesToPayload,
  type HealthHistoryFormValues,
} from "@/app/(dashboards)/patient/_lib/health-history"
import HealthHistoryForm from "@/app/(dashboards)/patient/health-history/_components/health-history-form"
import useApi from "@/hooks/use-api"
import {
  type CreateHealthHistoryPayload,
  HEALTH_HISTORY_API,
  HEALTH_HISTORY_QUERY_KEYS,
} from "@/lib/api/health-history"

export default function NewHealthHistoryPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { onRequest: createHealthHistoryEntry, isPending } =
    useApi<CreateHealthHistoryPayload>({
      key: "create-health-history-entry",
      method: "post",
    })

  function handleSubmit(values: HealthHistoryFormValues) {
    createHealthHistoryEntry({
      path: HEALTH_HISTORY_API.create,
      data: formValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: HEALTH_HISTORY_QUERY_KEYS.list,
        })
        router.push("/patient/health-history")
      },
    })
  }

  return (
    <HealthHistoryForm
      title="Add Diagnosis"
      description="Record an illness or condition with diagnosis date, provider, and treatment details."
      submitLabel="Save"
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
