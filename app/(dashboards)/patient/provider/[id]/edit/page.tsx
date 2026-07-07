"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"

import {
  type CareProviderFormValues,
  careProviderToFormValues,
  formValuesToPayload,
} from "@/app/(dashboards)/patient/_lib/providers"
import CareProviderForm from "@/app/(dashboards)/patient/provider/_components/care-provider-form"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  CARE_PROVIDERS_API,
  CARE_PROVIDERS_QUERY_KEYS,
  type CareProvidersListResponse,
  type UpdateCareProviderPayload,
} from "@/lib/api/care-providers"

export default function EditCareProviderPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useFetch<CareProvidersListResponse>({
    path: CARE_PROVIDERS_API.list,
    queryKey: CARE_PROVIDERS_QUERY_KEYS.list,
  })

  const provider = useMemo(
    () => data?.providers.find((item) => item.id === params.id) ?? null,
    [data?.providers, params.id]
  )

  const { onRequest: updateCareProvider, isPending } =
    useApi<UpdateCareProviderPayload>({
      key: "update-care-provider",
      method: "patch",
    })

  function handleSubmit(values: CareProviderFormValues) {
    if (!provider) return

    updateCareProvider({
      path: CARE_PROVIDERS_API.update(provider.id),
      data: formValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: CARE_PROVIDERS_QUERY_KEYS.list,
        })
        router.push("/patient/provider")
      },
    })
  }

  if (isLoading) {
    return <Loader variant="full-page" label="Loading care provider..." />
  }

  if (!provider) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Care provider not found</Typography>
        <Typography variant="muted" className="mt-2">
          This provider may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <CareProviderForm
      key={provider.id}
      title="Edit Care Provider"
      description={`Update details for ${provider.name}.`}
      defaultValues={careProviderToFormValues(provider)}
      submitLabel="Save Changes"
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
