"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import {
  formValuesToVaccination,
  getVaccinationById,
  getVaccinationsFromStorage,
  saveVaccinationsToStorage,
  type Vaccination,
  type VaccinationFormValues,
  vaccinationToFormValues,
} from "@/app/(dashboards)/patient/_lib/vaccinations"
import VaccinationForm from "@/app/(dashboards)/patient/vaccinations/_components/vaccination-form"
import { Typography } from "@/components/ui/typography"

export default function EditVaccinationPage() {
  const params = useParams<{ id: string }>()
  const [vaccination, setVaccination] = useState<Vaccination | null>(null)

  useEffect(() => {
    setVaccination(getVaccinationById(params.id) ?? null)
  }, [params.id])

  function handleSubmit(values: VaccinationFormValues) {
    if (!vaccination) return

    const vaccinations = getVaccinationsFromStorage()
    const updated = formValuesToVaccination(values, vaccination.id)
    saveVaccinationsToStorage(
      vaccinations.map((item) => (item.id === vaccination.id ? updated : item))
    )
  }

  if (!vaccination) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Vaccination not found</Typography>
        <Typography variant="muted" className="mt-2">
          This record may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <VaccinationForm
      key={vaccination.id}
      title="Edit Vaccination"
      description={`Update details for ${vaccination.vaccineName}.`}
      defaultValues={vaccinationToFormValues(vaccination)}
      submitLabel="Save Changes"
      onSubmit={handleSubmit}
    />
  )
}
