import { format, isValid, parse } from "date-fns"
import { z } from "zod"

export type Vaccination = {
  id: string
  vaccineName: string
  prescribedBy: string
  administeredBy: string
  dosage: string
  date: string
  time: string
}

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

export const initialVaccinations: Vaccination[] = [
  {
    id: "1",
    vaccineName: "Influenza (Flu)",
    prescribedBy: "Dr. Brooklyn Belle",
    administeredBy: "CVS Pharmacy",
    dosage: "0.5 mL",
    date: "10/15/2025",
    time: "10:30 AM",
  },
  {
    id: "2",
    vaccineName: "COVID-19 Booster",
    prescribedBy: "Dr. John Richards",
    administeredBy: "UHC Clinic",
    dosage: "0.3 mL",
    date: "09/03/2025",
    time: "02:15 PM",
  },
  {
    id: "3",
    vaccineName: "Tdap",
    prescribedBy: "Dr. Brooklyn Belle",
    administeredBy: "Dr. Brooklyn Belle",
    dosage: "0.5 mL",
    date: "01/20/2024",
    time: "11:00 AM",
  },
  {
    id: "4",
    vaccineName: "MMR",
    prescribedBy: "Dr. Jane Mitchell",
    administeredBy: "UHC Clinic",
    dosage: "0.5 mL",
    date: "06/12/2023",
    time: "09:45 AM",
  },
  {
    id: "5",
    vaccineName: "Hepatitis B",
    prescribedBy: "Dr. John Richards",
    administeredBy: "UHC Clinic",
    dosage: "1.0 mL",
    date: "03/08/2022",
    time: "03:30 PM",
  },
  {
    id: "6",
    vaccineName: "Shingles (Shingrix)",
    prescribedBy: "Dr. Brooklyn Belle",
    administeredBy: "CVS Pharmacy",
    dosage: "0.5 mL",
    date: "11/22/2025",
    time: "04:00 PM",
  },
]

export const VACCINATIONS_STORAGE_KEY = "uhc-vaccinations"

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

export function getVaccinationsFromStorage(): Vaccination[] {
  if (typeof window === "undefined") return initialVaccinations

  try {
    const stored = localStorage.getItem(VACCINATIONS_STORAGE_KEY)
    if (!stored) return initialVaccinations
    return JSON.parse(stored) as Vaccination[]
  } catch {
    return initialVaccinations
  }
}

export function saveVaccinationsToStorage(vaccinations: Vaccination[]) {
  localStorage.setItem(VACCINATIONS_STORAGE_KEY, JSON.stringify(vaccinations))
}

export function getVaccinationById(id: string): Vaccination | undefined {
  return getVaccinationsFromStorage().find(
    (vaccination) => vaccination.id === id
  )
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

export function formValuesToVaccination(
  values: VaccinationFormValues,
  id: string
): Vaccination {
  return {
    id,
    vaccineName: values.vaccineName,
    prescribedBy: values.prescribedBy,
    administeredBy: values.administeredBy,
    dosage: values.dosage,
    date: formatVaccinationDate(values.date),
    time: formatVaccinationTime(values.time),
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
