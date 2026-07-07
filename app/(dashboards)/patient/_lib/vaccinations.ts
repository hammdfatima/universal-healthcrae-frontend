import { format, isValid, parse } from "date-fns"
import { z } from "zod"

import type { Vaccination } from "@/lib/api/vaccinations"

export type { Vaccination }

export const vaccinationSchema = z.object({
  vaccineName: z.string().min(1, "Vaccine name is required."),
  prescribedBy: z.string().min(1, "Prescribed by is required."),
  administeredBy: z.string().min(1, "Administrated by is required."),
  dosage: z.string().min(1, "Dosage is required."),
  date: z.date({ message: "Date is required." }),
  time: z.string().min(1, "Time is required."),
})

export type VaccinationFormValues = z.infer<typeof vaccinationSchema>

export const vaccinationDefaultValues: VaccinationFormValues = {
  vaccineName: "",
  prescribedBy: "",
  administeredBy: "",
  dosage: "",
  date: undefined as unknown as Date,
  time: "",
}

export function formatVaccinationDate(date: Date): string {
  return format(date, "MM/dd/yyyy")
}

export function parseVaccinationDate(
  value: string | null | undefined
): Date | undefined {
  if (!value) return undefined
  const parsed = parse(value, "MM/dd/yyyy", new Date())
  return isValid(parsed) ? parsed : undefined
}

export function formatVaccinationTime(value: string): string {
  const parsed = parse(value, "HH:mm", new Date())
  if (isValid(parsed)) return format(parsed, "hh:mm a")
  return value
}

export function parseVaccinationTime(value: string | null | undefined): string {
  if (!value) return ""

  const from24Hour = parse(value, "HH:mm", new Date())
  if (isValid(from24Hour)) return format(from24Hour, "HH:mm")

  const from12Hour = parse(value, "hh:mm a", new Date())
  if (isValid(from12Hour)) return format(from12Hour, "HH:mm")

  return ""
}

export function vaccinationToFormValues(
  vaccination: Vaccination
): VaccinationFormValues {
  return {
    vaccineName: vaccination.vaccineName,
    prescribedBy: vaccination.prescribedBy,
    administeredBy: vaccination.administeredBy,
    dosage: vaccination.dosage,
    date: parseVaccinationDate(vaccination.date) as Date,
    time: parseVaccinationTime(vaccination.time),
  }
}

export function formValuesToPayload(values: VaccinationFormValues) {
  return {
    vaccineName: values.vaccineName.trim(),
    prescribedBy: values.prescribedBy.trim(),
    administeredBy: values.administeredBy.trim(),
    dosage: values.dosage.trim(),
    date: formatVaccinationDate(values.date),
    time: values.time.trim(),
  }
}

export function getPrescribedByFilterOptions(vaccinations: Vaccination[]) {
  const names = [...new Set(vaccinations.map((v) => v.prescribedBy))]
  return names.map((name) => ({ label: name, value: name }))
}

export function getAdministeredByFilterOptions(vaccinations: Vaccination[]) {
  const names = [...new Set(vaccinations.map((v) => v.administeredBy))]
  return names.map((name) => ({ label: name, value: name }))
}
