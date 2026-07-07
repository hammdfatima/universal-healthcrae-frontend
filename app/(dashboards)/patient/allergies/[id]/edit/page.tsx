"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"

import {
  type AllergyFormValues,
  allergyToFormValues,
  formValuesToPayload,
} from "@/app/(dashboards)/patient/_lib/allergies"
import AllergyForm from "@/app/(dashboards)/patient/allergies/_components/allergy-form"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  ALLERGIES_API,
  ALLERGIES_QUERY_KEYS,
  type AllergiesListResponse,
  type UpdateAllergyPayload,
} from "@/lib/api/allergies"

export default function EditAllergyPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useFetch<AllergiesListResponse>({
    path: ALLERGIES_API.list,
    queryKey: ALLERGIES_QUERY_KEYS.list,
  })

  const allergy = useMemo(
    () => data?.allergies.find((item) => item.id === params.id) ?? null,
    [data?.allergies, params.id]
  )

  const { onRequest: updateAllergy, isPending } = useApi<UpdateAllergyPayload>({
    key: "update-allergy",
    method: "patch",
  })

  function handleSubmit(values: AllergyFormValues) {
    if (!allergy) return

    updateAllergy({
      path: ALLERGIES_API.update(allergy.id),
      data: formValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ALLERGIES_QUERY_KEYS.list,
        })
        router.push("/patient/allergies")
      },
    })
  }

  if (isLoading) {
    return <Loader variant="full-page" label="Loading allergy..." />
  }

  if (!allergy) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Allergy not found</Typography>
        <Typography variant="muted" className="mt-2">
          This allergy record may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <AllergyForm
      key={allergy.id}
      title="Edit Allergy"
      description={`Update details for your ${allergy.allergyType.toLowerCase()} allergy.`}
      defaultValues={allergyToFormValues(allergy)}
      submitLabel="Save Changes"
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
