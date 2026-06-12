import { format } from "date-fns"
import { z } from "zod"

export type CustomVitalField = {
  id: string
  fieldName: string
  value: string
}

export type PatientVitals = {
  heightCm: string
  weightKg: string
  bmi: string
  bloodPressureSystolic: string
  bloodPressureDiastolic: string
  temperatureCelsius: string
  heartRate: string
  respiratoryRate: string
  totalCholesterol: string
  customFields: CustomVitalField[]
  addedOn: string
  updatedOn: string
}

const customFieldSchema = z.object({
  id: z.string(),
  fieldName: z.string(),
  value: z.string(),
})

export const vitalsSchema = z
  .object({
    heightCm: z.string(),
    weightKg: z.string(),
    bmi: z.string(),
    bloodPressureSystolic: z.string(),
    bloodPressureDiastolic: z.string(),
    temperatureCelsius: z.string(),
    heartRate: z.string(),
    respiratoryRate: z.string(),
    totalCholesterol: z.string(),
    customFields: z.array(customFieldSchema),
  })
  .superRefine((data, ctx) => {
    data.customFields.forEach((field, index) => {
      const hasName = field.fieldName.trim().length > 0
      const hasValue = field.value.trim().length > 0

      if (hasName && !hasValue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a value for this field.",
          path: ["customFields", index, "value"],
        })
      }

      if (hasValue && !hasName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a field name.",
          path: ["customFields", index, "fieldName"],
        })
      }
    })
  })

export type VitalsFormValues = z.infer<typeof vitalsSchema>

export const vitalsDefaultValues: VitalsFormValues = {
  heightCm: "",
  weightKg: "",
  bmi: "",
  bloodPressureSystolic: "",
  bloodPressureDiastolic: "",
  temperatureCelsius: "",
  heartRate: "",
  respiratoryRate: "",
  totalCholesterol: "",
  customFields: [],
}

export const initialVitals: PatientVitals = {
  heightCm: "175",
  weightKg: "72",
  bmi: "23.5",
  bloodPressureSystolic: "118",
  bloodPressureDiastolic: "76",
  temperatureCelsius: "36.6",
  heartRate: "72",
  respiratoryRate: "16",
  totalCholesterol: "185",
  customFields: [{ id: "1", fieldName: "Oxygen Saturation", value: "98%" }],
  addedOn: "Jan 10, 2025 at 09:30 AM",
  updatedOn: "Mar 18, 2025 at 02:15 PM",
}

export const VITALS_STORAGE_KEY = "uhc-patient-vitals"

export function formatVitalsTimestamp(date: Date): string {
  return format(date, "MMM dd, yyyy 'at' hh:mm a")
}

export function formatVitalDisplay(value: string, unit?: string): string {
  if (!value.trim()) return "—"
  return unit ? `${value} ${unit}` : value
}

export function getVitalsFromStorage(): PatientVitals {
  if (typeof window === "undefined") return initialVitals

  try {
    const stored = localStorage.getItem(VITALS_STORAGE_KEY)
    if (!stored) return initialVitals
    return JSON.parse(stored) as PatientVitals
  } catch {
    return initialVitals
  }
}

export function saveVitalsToStorage(vitals: PatientVitals) {
  localStorage.setItem(VITALS_STORAGE_KEY, JSON.stringify(vitals))
}

export function vitalsToFormValues(vitals: PatientVitals): VitalsFormValues {
  return {
    heightCm: vitals.heightCm,
    weightKg: vitals.weightKg,
    bmi: vitals.bmi,
    bloodPressureSystolic: vitals.bloodPressureSystolic,
    bloodPressureDiastolic: vitals.bloodPressureDiastolic,
    temperatureCelsius: vitals.temperatureCelsius,
    heartRate: vitals.heartRate,
    respiratoryRate: vitals.respiratoryRate,
    totalCholesterol: vitals.totalCholesterol,
    customFields: vitals.customFields.map((field) => ({ ...field })),
  }
}

export function formValuesToVitals(
  values: VitalsFormValues
): Omit<PatientVitals, "addedOn" | "updatedOn"> {
  return {
    heightCm: values.heightCm.trim(),
    weightKg: values.weightKg.trim(),
    bmi: values.bmi.trim(),
    bloodPressureSystolic: values.bloodPressureSystolic.trim(),
    bloodPressureDiastolic: values.bloodPressureDiastolic.trim(),
    temperatureCelsius: values.temperatureCelsius.trim(),
    heartRate: values.heartRate.trim(),
    respiratoryRate: values.respiratoryRate.trim(),
    totalCholesterol: values.totalCholesterol.trim(),
    customFields: values.customFields
      .filter(
        (field) =>
          field.fieldName.trim().length > 0 || field.value.trim().length > 0
      )
      .map((field) => ({
        id: field.id,
        fieldName: field.fieldName.trim(),
        value: field.value.trim(),
      })),
  }
}

export const standardVitalFields = [
  {
    key: "heightCm" as const,
    label: "Height (CM)",
    unit: "cm",
    placeholder: "CM",
  },
  {
    key: "weightKg" as const,
    label: "Weight (kg)",
    unit: "kg",
    placeholder: "Kg",
  },
  {
    key: "bmi" as const,
    label: "BMI",
    placeholder: "BMI",
  },
  {
    key: "bloodPressureSystolic" as const,
    label: "Blood Pressure (Systolic)",
    unit: "mmHg",
    placeholder: "Blood Pressure (Systolic)",
  },
  {
    key: "bloodPressureDiastolic" as const,
    label: "Blood Pressure (Diastolic)",
    unit: "mmHg",
    placeholder: "Blood Pressure (Diastolic)",
  },
  {
    key: "temperatureCelsius" as const,
    label: "Temperature (Celsius)",
    unit: "°C",
    placeholder: "Temperature",
  },
  {
    key: "heartRate" as const,
    label: "Heart Rate",
    unit: "bpm",
    placeholder: "Heart Rate",
  },
  {
    key: "respiratoryRate" as const,
    label: "Respiratory Rate",
    unit: "/min",
    placeholder: "Respiratory Rate",
  },
  {
    key: "totalCholesterol" as const,
    label: "Total Cholesterol",
    unit: "mg/dL",
    placeholder: "Cholesterol",
  },
] as const
