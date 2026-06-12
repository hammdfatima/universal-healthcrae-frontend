"use client"

import {
  formValuesToVaccination,
  getVaccinationsFromStorage,
  saveVaccinationsToStorage,
  type VaccinationFormValues,
} from "@/app/(dashboards)/patient/_lib/vaccinations"
import VaccinationForm from "@/app/(dashboards)/patient/vaccinations/_components/vaccination-form"

export default function NewVaccinationPage() {
  function handleSubmit(values: VaccinationFormValues) {
    const vaccinations = getVaccinationsFromStorage()
    const newVaccination = formValuesToVaccination(values, crypto.randomUUID())
    saveVaccinationsToStorage([...vaccinations, newVaccination])
  }

  return (
    <VaccinationForm
      title="Add Vaccination"
      description="Record vaccine details, provider information, dosage, date, and time."
      submitLabel="Save"
      onSubmit={handleSubmit}
    />
  )
}
