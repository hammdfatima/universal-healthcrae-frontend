"use client"

import {
  formValuesToMedication,
  getMedicationsFromStorage,
  type MedicationFormValues,
  saveMedicationsToStorage,
} from "@/app/(dashboards)/patient/_lib/medications"
import MedicationForm from "@/app/(dashboards)/patient/medications/_components/medication-form"

export default function NewMedicationPage() {
  function handleSubmit(values: MedicationFormValues) {
    const medications = getMedicationsFromStorage()
    const newMedication = formValuesToMedication(values, crypto.randomUUID())
    saveMedicationsToStorage([...medications, newMedication])
  }

  return (
    <MedicationForm
      title="Add Medication"
      description="Record a new prescription with medicine details, dosage, and dates."
      submitLabel="Save"
      onSubmit={handleSubmit}
    />
  )
}
