"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"

import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import {
  formValuesToPayload,
  type VaccinationFormValues,
  vaccinationToFormValues,
} from "@/app/(dashboards)/patient/_lib/vaccinations"
import VaccinationForm from "@/app/(dashboards)/patient/vaccinations/_components/vaccination-form"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  type UpdateVaccinationPayload,
  VACCINATIONS_API,
  VACCINATIONS_QUERY_KEYS,
  type VaccinationsListResponse,
} from "@/lib/api/vaccinations"

export default function EditVaccinationPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useFetch<VaccinationsListResponse>({
    path: VACCINATIONS_API.list,
    queryKey: VACCINATIONS_QUERY_KEYS.list,
  })

  const vaccination = useMemo(
    () => data?.vaccinations.find((item) => item.id === params.id) ?? null,
    [data?.vaccinations, params.id]
  )

  const { onRequest: updateVaccination, isPending } =
    useApi<UpdateVaccinationPayload>({
      key: "update-vaccination",
      method: "patch",
    })

  function handleSubmit(values: VaccinationFormValues) {
    if (!vaccination) return

    updateVaccination({
      path: VACCINATIONS_API.update(vaccination.id),
      data: formValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: VACCINATIONS_QUERY_KEYS.list,
        })
        router.push(healthRecordHref("immunizations"))
      },
    })
  }

  if (isLoading) {
    return <Loader variant="full-page" label="Loading vaccination..." />
  }

  if (!vaccination) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Vaccination not found</Typography>
        <Typography variant="muted" className="mt-2">
          This record may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <VaccinationForm
      key={vaccination.id}
      title="Edit Vaccination"
      description={`Update details for ${vaccination.vaccineName}.`}
      defaultValues={vaccinationToFormValues(vaccination)}
      submitLabel="Save Changes"
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
