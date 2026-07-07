"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import {
  type CareProviderFormValues,
  formValuesToPayload,
} from "@/app/(dashboards)/patient/_lib/providers"
import CareProviderForm from "@/app/(dashboards)/patient/provider/_components/care-provider-form"
import useApi from "@/hooks/use-api"
import {
  CARE_PROVIDERS_API,
  CARE_PROVIDERS_QUERY_KEYS,
  type CreateCareProviderPayload,
} from "@/lib/api/care-providers"

export default function NewCareProviderPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { onRequest: createCareProvider, isPending } =
    useApi<CreateCareProviderPayload>({
      key: "create-care-provider",
      method: "post",
    })

  function handleSubmit(values: CareProviderFormValues) {
    createCareProvider({
      path: CARE_PROVIDERS_API.create,
      data: formValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: CARE_PROVIDERS_QUERY_KEYS.list,
        })
        router.push("/patient/provider")
      },
    })
  }

  return (
    <CareProviderForm
      title="Add Care Provider"
      description="Add a doctor or healthcare provider with contact and clinic details."
      submitLabel="Save"
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
