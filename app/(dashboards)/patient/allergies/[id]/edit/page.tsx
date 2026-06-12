"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import {
  type Allergy,
  type AllergyFormValues,
  allergyToFormValues,
  formValuesToAllergy,
  getAllergiesFromStorage,
  getAllergyById,
  saveAllergiesToStorage,
} from "@/app/(dashboards)/patient/_lib/allergies"
import AllergyForm from "@/app/(dashboards)/patient/allergies/_components/allergy-form"
import { Typography } from "@/components/ui/typography"

export default function EditAllergyPage() {
  const params = useParams<{ id: string }>()
  const [allergy, setAllergy] = useState<Allergy | null>(null)

  useEffect(() => {
    setAllergy(getAllergyById(params.id) ?? null)
  }, [params.id])

  function handleSubmit(values: AllergyFormValues) {
    if (!allergy) return

    const allergies = getAllergiesFromStorage()
    const updated = formValuesToAllergy(values, allergy.id)
    saveAllergiesToStorage(
      allergies.map((item) => (item.id === allergy.id ? updated : item))
    )
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
      onSubmit={handleSubmit}
    />
  )
}
