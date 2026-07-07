"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import {
  formValuesToPayload,
  type VaccinationFormValues,
} from "@/app/(dashboards)/patient/_lib/vaccinations"
import VaccinationForm from "@/app/(dashboards)/patient/vaccinations/_components/vaccination-form"
import useApi from "@/hooks/use-api"
import {
  type CreateVaccinationPayload,
  VACCINATIONS_API,
  VACCINATIONS_QUERY_KEYS,
} from "@/lib/api/vaccinations"

export default function NewVaccinationPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { onRequest: createVaccination, isPending } =
    useApi<CreateVaccinationPayload>({
      key: "create-vaccination",
      method: "post",
    })

  function handleSubmit(values: VaccinationFormValues) {
    createVaccination({
      path: VACCINATIONS_API.create,
      data: formValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: VACCINATIONS_QUERY_KEYS.list,
        })
        router.push("/patient/vaccinations")
      },
    })
  }

  return (
    <VaccinationForm
      title="Add Vaccination"
      description="Record vaccine details, provider information, dosage, date, and time."
      submitLabel="Save"
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
