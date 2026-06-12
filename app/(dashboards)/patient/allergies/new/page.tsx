"use client"

import {
  type AllergyFormValues,
  formValuesToAllergy,
  getAllergiesFromStorage,
  saveAllergiesToStorage,
} from "@/app/(dashboards)/patient/_lib/allergies"
import AllergyForm from "@/app/(dashboards)/patient/allergies/_components/allergy-form"

export default function NewAllergyPage() {
  function handleSubmit(values: AllergyFormValues) {
    const allergies = getAllergiesFromStorage()
    const newAllergy = formValuesToAllergy(values, crypto.randomUUID())
    saveAllergiesToStorage([...allergies, newAllergy])
  }

  return (
    <AllergyForm
      title="Add Allergy"
      description="Record allergy type, severity, symptoms, and food triggers when applicable."
      submitLabel="Save"
      onSubmit={handleSubmit}
    />
  )
}
