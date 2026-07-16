"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"

import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import {
  formValuesToPayload,
  type MedicationFormValues,
  medicationToFormValues,
} from "@/app/(dashboards)/patient/_lib/medications"
import MedicationForm from "@/app/(dashboards)/patient/medications/_components/medication-form"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  MEDICATIONS_API,
  MEDICATIONS_QUERY_KEYS,
  type MedicationsListResponse,
  type UpdateMedicationPayload,
} from "@/lib/api/medications"

export default function EditMedicationPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useFetch<MedicationsListResponse>({
    path: MEDICATIONS_API.list,
    queryKey: MEDICATIONS_QUERY_KEYS.list,
  })

  const medication = useMemo(
    () => data?.medications.find((item) => item.id === params.id) ?? null,
    [data?.medications, params.id]
  )

  const { onRequest: updateMedication, isPending } =
    useApi<UpdateMedicationPayload>({
      key: "update-medication",
      method: "patch",
    })

  function handleSubmit(values: MedicationFormValues) {
    if (!medication) return

    updateMedication({
      path: MEDICATIONS_API.update(medication.id),
      data: formValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: MEDICATIONS_QUERY_KEYS.list,
        })
        router.push(healthRecordHref("medications"))
      },
    })
  }

  if (isLoading) {
    return <Loader variant="full-page" label="Loading medication..." />
  }

  if (!medication) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Medication not found</Typography>
        <Typography variant="muted" className="mt-2">
          This medication may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <MedicationForm
      key={medication.id}
      title="Edit Medication"
      description={`Update details for ${medication.medicineName}.`}
      defaultValues={medicationToFormValues(medication)}
      submitLabel="Save Changes"
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
