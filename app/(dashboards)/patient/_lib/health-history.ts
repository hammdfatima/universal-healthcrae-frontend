import { format, isValid, parse } from "date-fns"
import { z } from "zod"

import type { HealthHistoryEntry } from "@/lib/api/health-history"

export type { HealthHistoryEntry }

export const healthHistorySchema = z.object({
  illnessName: z.string().min(1, "Illness or condition name is required."),
  diagnosisDate: z.date({ message: "Date of diagnosis is required." }),
  prescribedBy: z.string().min(1, "GP / Consultant name is required."),
  details: z
    .string()
    .min(1, "Details including medication or treatment are required."),
})

export type HealthHistoryFormValues = z.infer<typeof healthHistorySchema>

export const healthHistoryDefaultValues: HealthHistoryFormValues = {
  illnessName: "",
  diagnosisDate: undefined as unknown as Date,
  prescribedBy: "",
  details: "",
}

export function formatHealthHistoryDate(date: Date): string {
  return format(date, "MM/dd/yyyy")
}

export function parseHealthHistoryDate(
  value: string | null | undefined
): Date | undefined {
  if (!value) return undefined
  const parsed = parse(value, "MM/dd/yyyy", new Date())
  return isValid(parsed) ? parsed : undefined
}

export function healthHistoryToFormValues(
  entry: HealthHistoryEntry
): HealthHistoryFormValues {
  return {
    illnessName: entry.illnessName,
    diagnosisDate: parseHealthHistoryDate(entry.diagnosisDate) as Date,
    prescribedBy: entry.prescribedBy,
    details: entry.details,
  }
}

export function formValuesToPayload(values: HealthHistoryFormValues) {
  return {
    illnessName: values.illnessName.trim(),
    diagnosisDate: formatHealthHistoryDate(values.diagnosisDate),
    prescribedBy: values.prescribedBy.trim(),
    details: values.details.trim(),
  }
}

export function getPrescribedByFilterOptions(entries: HealthHistoryEntry[]) {
  const names = [...new Set(entries.map((entry) => entry.prescribedBy))]
  return names.map((name) => ({ label: name, value: name }))
}

export function truncateDetails(details: string, max = 60): string {
  if (details.length <= max) return details
  return `${details.slice(0, max).trim()}…`
}
