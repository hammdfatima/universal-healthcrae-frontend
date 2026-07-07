"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import {
  type AllergyFormValues,
  formValuesToPayload,
} from "@/app/(dashboards)/patient/_lib/allergies"
import AllergyForm from "@/app/(dashboards)/patient/allergies/_components/allergy-form"
import useApi from "@/hooks/use-api"
import {
  ALLERGIES_API,
  ALLERGIES_QUERY_KEYS,
  type CreateAllergyPayload,
} from "@/lib/api/allergies"

export default function NewAllergyPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { onRequest: createAllergy, isPending } = useApi<CreateAllergyPayload>({
    key: "create-allergy",
    method: "post",
  })

  function handleSubmit(values: AllergyFormValues) {
    createAllergy({
      path: ALLERGIES_API.create,
      data: formValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ALLERGIES_QUERY_KEYS.list,
        })
        router.push("/patient/allergies")
      },
    })
  }

  return (
    <AllergyForm
      title="Add Allergy"
      description="Record allergy type, severity, symptoms, and food triggers when applicable."
      submitLabel="Save"
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
