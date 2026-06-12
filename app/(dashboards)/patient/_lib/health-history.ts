import { format, isValid, parse } from "date-fns"
import { z } from "zod"

export type HealthHistoryEntry = {
  id: string
  illnessName: string
  diagnosisDate: string
  prescribedBy: string
  details: string
}

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

export const initialHealthHistory: HealthHistoryEntry[] = [
  {
    id: "1",
    illnessName: "Type 2 Diabetes",
    diagnosisDate: "03/15/2019",
    prescribedBy: "Dr. Brooklyn Belle",
    details:
      "Diagnosed following elevated HbA1c. Started on Metformin 500 mg twice daily with lifestyle changes.",
  },
  {
    id: "2",
    illnessName: "Hypertension",
    diagnosisDate: "08/22/2020",
    prescribedBy: "Dr. John Richards",
    details:
      "Stage 1 hypertension confirmed after multiple readings. Prescribed Lisinopril 10 mg daily.",
  },
]

export const HEALTH_HISTORY_STORAGE_KEY = "uhc-health-history"

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

export function getHealthHistoryFromStorage(): HealthHistoryEntry[] {
  if (typeof window === "undefined") return initialHealthHistory

  try {
    const stored = localStorage.getItem(HEALTH_HISTORY_STORAGE_KEY)
    if (!stored) return initialHealthHistory
    return JSON.parse(stored) as HealthHistoryEntry[]
  } catch {
    return initialHealthHistory
  }
}

export function saveHealthHistoryToStorage(entries: HealthHistoryEntry[]) {
  localStorage.setItem(HEALTH_HISTORY_STORAGE_KEY, JSON.stringify(entries))
}

export function getHealthHistoryEntryById(
  id: string
): HealthHistoryEntry | undefined {
  return getHealthHistoryFromStorage().find((entry) => entry.id === id)
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

export function formValuesToHealthHistoryEntry(
  values: HealthHistoryFormValues,
  id: string
): HealthHistoryEntry {
  return {
    id,
    illnessName: values.illnessName,
    diagnosisDate: formatHealthHistoryDate(values.diagnosisDate),
    prescribedBy: values.prescribedBy,
    details: values.details,
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
