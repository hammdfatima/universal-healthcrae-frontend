"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import {
  formValuesToPayload,
  type MedicationFormValues,
} from "@/app/(dashboards)/patient/_lib/medications"
import MedicationForm from "@/app/(dashboards)/patient/medications/_components/medication-form"
import useApi from "@/hooks/use-api"
import {
  type CreateMedicationPayload,
  MEDICATIONS_API,
  MEDICATIONS_QUERY_KEYS,
} from "@/lib/api/medications"

export default function NewMedicationPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { onRequest: createMedication, isPending } =
    useApi<CreateMedicationPayload>({
      key: "create-medication",
      method: "post",
    })

  function handleSubmit(values: MedicationFormValues) {
    createMedication({
      path: MEDICATIONS_API.create,
      data: formValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: MEDICATIONS_QUERY_KEYS.list,
        })
        router.push("/patient/medications")
      },
    })
  }

  return (
    <MedicationForm
      title="Add Medication"
      description="Record a new prescription with medicine details, dosage, and dates."
      submitLabel="Save"
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
