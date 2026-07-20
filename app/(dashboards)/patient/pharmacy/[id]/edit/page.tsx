"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"
import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import {
  formValuesToPayload,
  type PharmacyFormValues,
  pharmacyToFormValues,
} from "@/app/(dashboards)/patient/_lib/pharmacies"
import PharmacyForm from "@/app/(dashboards)/patient/pharmacy/_components/pharmacy-form"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  PHARMACIES_API,
  PHARMACIES_QUERY_KEYS,
  type PharmaciesListResponse,
  type UpdatePharmacyPayload,
} from "@/lib/api/pharmacies"

export default function EditPharmacyPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useFetch<PharmaciesListResponse>({
    path: PHARMACIES_API.list,
    queryKey: PHARMACIES_QUERY_KEYS.list,
  })

  const pharmacy = useMemo(
    () => data?.pharmacies.find((item) => item.id === params.id) ?? null,
    [data?.pharmacies, params.id]
  )

  const { onRequest: updatePharmacy, isPending } =
    useApi<UpdatePharmacyPayload>({
      key: "update-pharmacy",
      method: "patch",
    })

  function handleSubmit(values: PharmacyFormValues) {
    if (!pharmacy) return

    updatePharmacy({
      path: PHARMACIES_API.update(pharmacy.id),
      data: formValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: PHARMACIES_QUERY_KEYS.list,
        })
        router.push(healthRecordHref("pharmacy"))
      },
    })
  }

  if (isLoading) {
    return <Loader variant="full-page" label="Loading pharmacy..." />
  }

  if (!pharmacy) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Pharmacy not found</Typography>
        <Typography variant="muted" className="mt-2">
          This pharmacy may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <PharmacyForm
      key={pharmacy.id}
      title="Edit Preferred Pharmacy"
      description={`Update details for ${pharmacy.name}.`}
      defaultValues={pharmacyToFormValues(pharmacy)}
      submitLabel="Save Changes"
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
