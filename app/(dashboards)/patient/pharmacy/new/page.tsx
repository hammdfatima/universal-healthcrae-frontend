"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import {
  formValuesToPayload,
  type PharmacyFormValues,
} from "@/app/(dashboards)/patient/_lib/pharmacies"
import PharmacyForm from "@/app/(dashboards)/patient/pharmacy/_components/pharmacy-form"
import useApi from "@/hooks/use-api"
import {
  type CreatePharmacyPayload,
  PHARMACIES_API,
  PHARMACIES_QUERY_KEYS,
} from "@/lib/api/pharmacies"

export default function NewPharmacyPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { onRequest: createPharmacy, isPending } =
    useApi<CreatePharmacyPayload>({
      key: "create-pharmacy",
      method: "post",
    })

  function handleSubmit(values: PharmacyFormValues) {
    createPharmacy({
      path: PHARMACIES_API.create,
      data: formValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: PHARMACIES_QUERY_KEYS.list,
        })
        router.push(healthRecordHref("pharmacy"))
      },
    })
  }

  return (
    <PharmacyForm
      title="Add Preferred Pharmacy"
      description="Save pharmacy contact details for prescriptions and refills."
      submitLabel="Save"
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
