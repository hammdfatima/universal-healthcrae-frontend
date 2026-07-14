import { format, isAfter, isValid, parse, startOfDay } from "date-fns"
import { z } from "zod"

import type { Medication } from "@/lib/api/medications"

export type { Medication }

const timeOfDaySchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a valid dose time.")

export const medicationSchema = z
  .object({
    medicineName: z.string().min(1, "Medicine name is required."),
    condition: z.string().min(1, "Condition is required."),
    prescribedBy: z.string().min(1, "Prescribed by is required."),
    dosage: z.string().min(1, "Dosage is required."),
    timesPerDay: z.coerce
      .number()
      .int()
      .min(1, "Times per day is required.")
      .max(6, "Maximum 6 doses per day."),
    timesOfDay: z
      .array(timeOfDaySchema)
      .min(1, "Add at least one dose time.")
      .max(6),
    startDate: z.date({ message: "Start date is required." }),
    endDate: z.date().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.timesOfDay.length !== value.timesPerDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Set one time for each daily dose.",
        path: ["timesOfDay"],
      })
    }

    const missingIndex = value.timesOfDay.findIndex((time) => !time)
    if (missingIndex >= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Choose a time for every dose.",
        path: ["timesOfDay", missingIndex],
      })
    }
  })

export type MedicationFormValues = z.infer<typeof medicationSchema>

export const DEFAULT_DOSE_SCHEDULES: Record<number, string[]> = {
  1: ["08:00"],
  2: ["08:00", "20:00"],
  3: ["08:00", "14:00", "20:00"],
  4: ["08:00", "12:00", "18:00", "22:00"],
  5: ["08:00", "11:00", "14:00", "17:00", "20:00"],
  6: ["08:00", "10:00", "12:00", "14:00", "16:00", "20:00"],
}

export function defaultTimesForPerDay(timesPerDay: number): string[] {
  return [...(DEFAULT_DOSE_SCHEDULES[timesPerDay] ?? DEFAULT_DOSE_SCHEDULES[1])]
}

export const medicationDefaultValues: MedicationFormValues = {
  medicineName: "",
  condition: "",
  prescribedBy: "",
  dosage: "",
  timesPerDay: 1,
  timesOfDay: defaultTimesForPerDay(1),
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

export function formatDoseTimeLabel(value: string): string {
  const parsed = parse(value, "HH:mm", new Date())
  if (!isValid(parsed)) return value
  return format(parsed, "h:mm a")
}

export function formatMedicationSchedule(medication: {
  timesPerDay: number
  timesOfDay: string[]
}): string {
  const times =
    medication.timesOfDay.length > 0
      ? medication.timesOfDay
      : defaultTimesForPerDay(medication.timesPerDay)

  const labels = times.map(formatDoseTimeLabel).join(", ")
  const doseLabel =
    medication.timesPerDay === 1
      ? "1 time/day"
      : `${medication.timesPerDay} times/day`

  return `${doseLabel} · ${labels}`
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
  const timesPerDay = medication.timesPerDay || 1
  const timesOfDay =
    medication.timesOfDay?.length === timesPerDay
      ? medication.timesOfDay
      : defaultTimesForPerDay(timesPerDay)

  return {
    medicineName: medication.medicineName,
    condition: medication.condition,
    prescribedBy: medication.prescribedBy,
    dosage: medication.dosage,
    timesPerDay,
    timesOfDay,
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
    timesPerDay: values.timesPerDay,
    timesOfDay: values.timesOfDay,
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

export type DueMedicationDose = {
  medication: Medication
  time: string
  label: string
}

export function getDueMedicationDoses(
  medications: Medication[],
  now = new Date(),
  windowMinutes = 60
): DueMedicationDose[] {
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const due: DueMedicationDose[] = []

  for (const medication of medications) {
    if (!isMedicationActive(medication.endDate)) continue

    const times =
      medication.timesOfDay?.length > 0
        ? medication.timesOfDay
        : defaultTimesForPerDay(medication.timesPerDay || 1)

    for (const time of times) {
      const parsed = parse(time, "HH:mm", new Date())
      if (!isValid(parsed)) continue

      const scheduled = parsed.getHours() * 60 + parsed.getMinutes()
      const elapsed = currentMinutes - scheduled

      if (elapsed >= 0 && elapsed <= windowMinutes) {
        due.push({
          medication,
          time,
          label: formatDoseTimeLabel(time),
        })
      }
    }
  }

  return due
}
