import { format, isValid, parse } from "date-fns"
import { z } from "zod"

export type Medication = {
  id: string
  medicineName: string
  condition: string
  prescribedBy: string
  dosage: string
  startDate: string
  endDate: string | null
}

export const medicationSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required."),
  condition: z.string().min(1, "Condition is required."),
  prescribedBy: z.string().min(1, "Prescribed by is required."),
  dosage: z.string().min(1, "Dosage is required."),
  startDate: z.date({ message: "Start date is required." }),
  endDate: z.date().optional(),
})

export type MedicationFormValues = z.infer<typeof medicationSchema>

export const medicationDefaultValues: MedicationFormValues = {
  medicineName: "",
  condition: "",
  prescribedBy: "",
  dosage: "",
  startDate: undefined as unknown as Date,
  endDate: undefined,
}

export const initialMedications: Medication[] = [
  {
    id: "1",
    medicineName: "Metformin",
    condition: "Type 2 Diabetes",
    prescribedBy: "Dr. Brooklyn Belle",
    dosage: "500 mg",
    startDate: "01/15/2024",
    endDate: null,
  },
  {
    id: "2",
    medicineName: "Lisinopril",
    condition: "Hypertension",
    prescribedBy: "Dr. John Richards",
    dosage: "10 mg",
    startDate: "03/22/2023",
    endDate: null,
  },
  {
    id: "3",
    medicineName: "Atorvastatin",
    condition: "High Cholesterol",
    prescribedBy: "Dr. John Richards",
    dosage: "20 mg",
    startDate: "06/10/2022",
    endDate: null,
  },
  {
    id: "4",
    medicineName: "Vitamin D3",
    condition: "Vitamin D Deficiency",
    prescribedBy: "Dr. Jane Mitchell",
    dosage: "2000 IU",
    startDate: "11/05/2025",
    endDate: "05/05/2026",
  },
]

export const MEDICATIONS_STORAGE_KEY = "uhc-medications"

export function formatMedicationDate(date: Date): string {
  return format(date, "MM/dd/yyyy")
}

export function parseMedicationDate(
  value: string | null | undefined
): Date | undefined {
  if (!value) return undefined
  const parsed = parse(value, "MM/dd/yyyy", new Date())
  return isValid(parsed) ? parsed : undefined
}

export function formatMedicationEndDate(value: string | null): string {
  return value ?? "—"
}

export function getMedicationsFromStorage(): Medication[] {
  if (typeof window === "undefined") return initialMedications

  try {
    const stored = localStorage.getItem(MEDICATIONS_STORAGE_KEY)
    if (!stored) return initialMedications
    return JSON.parse(stored) as Medication[]
  } catch {
    return initialMedications
  }
}

export function saveMedicationsToStorage(medications: Medication[]) {
  localStorage.setItem(MEDICATIONS_STORAGE_KEY, JSON.stringify(medications))
}

export function getMedicationById(id: string): Medication | undefined {
  return getMedicationsFromStorage().find((medication) => medication.id === id)
}

export function medicationToFormValues(
  medication: Medication
): MedicationFormValues {
  return {
    medicineName: medication.medicineName,
    condition: medication.condition,
    prescribedBy: medication.prescribedBy,
    dosage: medication.dosage,
    startDate: parseMedicationDate(medication.startDate) as Date,
    endDate: parseMedicationDate(medication.endDate),
  }
}

export function formValuesToMedication(
  values: MedicationFormValues,
  id: string
): Medication {
  return {
    id,
    medicineName: values.medicineName,
    condition: values.condition,
    prescribedBy: values.prescribedBy,
    dosage: values.dosage,
    startDate: formatMedicationDate(values.startDate),
    endDate: values.endDate ? formatMedicationDate(values.endDate) : null,
  }
}

export function getConditionFilterOptions(medications: Medication[]) {
  const conditions = [...new Set(medications.map((m) => m.condition))]
  return conditions.map((condition) => ({
    label: condition,
    value: condition,
  }))
}
