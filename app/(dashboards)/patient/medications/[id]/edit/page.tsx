"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import {
  formValuesToMedication,
  getMedicationById,
  getMedicationsFromStorage,
  type Medication,
  type MedicationFormValues,
  medicationToFormValues,
  saveMedicationsToStorage,
} from "@/app/(dashboards)/patient/_lib/medications"
import MedicationForm from "@/app/(dashboards)/patient/medications/_components/medication-form"
import { Typography } from "@/components/ui/typography"

export default function EditMedicationPage() {
  const params = useParams<{ id: string }>()
  const [medication, setMedication] = useState<Medication | null>(null)

  useEffect(() => {
    setMedication(getMedicationById(params.id) ?? null)
  }, [params.id])

  function handleSubmit(values: MedicationFormValues) {
    if (!medication) return

    const medications = getMedicationsFromStorage()
    const updated = formValuesToMedication(values, medication.id)
    saveMedicationsToStorage(
      medications.map((item) => (item.id === medication.id ? updated : item))
    )
  }

  if (!medication) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Medication not found</Typography>
        <Typography variant="muted" className="mt-2">
          This medication may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <MedicationForm
      key={medication.id}
      title="Edit Medication"
      description={`Update details for ${medication.medicineName}.`}
      defaultValues={medicationToFormValues(medication)}
      submitLabel="Save Changes"
      onSubmit={handleSubmit}
    />
  )
}
