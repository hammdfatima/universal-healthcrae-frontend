import { format, isAfter, isValid, parse, startOfDay } from "date-fns"
import { z } from "zod"

import type { Medication } from "@/lib/api/medications"

export type { Medication }

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

export function isMedicationEnded(endDate: string | null): boolean {
  if (!endDate) return false

  const parsedEndDate = parseMedicationDate(endDate)
  if (!parsedEndDate) return false

  return isAfter(startOfDay(new Date()), startOfDay(parsedEndDate))
}

export function isMedicationActive(endDate: string | null): boolean {
  return !isMedicationEnded(endDate)
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

export function formValuesToPayload(values: MedicationFormValues) {
  return {
    medicineName: values.medicineName.trim(),
    condition: values.condition.trim(),
    prescribedBy: values.prescribedBy.trim(),
    dosage: values.dosage.trim(),
    startDate: formatMedicationDate(values.startDate),
    endDate: values.endDate ? formatMedicationDate(values.endDate) : "",
  }
}

export function getConditionFilterOptions(medications: Medication[]) {
  const conditions = [...new Set(medications.map((m) => m.condition))]
  return conditions.map((condition) => ({
    label: condition,
    value: condition,
  }))
}
