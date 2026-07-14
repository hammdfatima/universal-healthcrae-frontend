export type Medication = {
  id: string
  medicineName: string
  condition: string
  prescribedBy: string
  dosage: string
  timesPerDay: number
  timesOfDay: string[]
  startDate: string
  endDate: string | null
  createdAt: string
  updatedAt: string
}

export type MedicationsListResponse = {
  medications: Medication[]
}

export type CreateMedicationPayload = {
  medicineName: string
  condition: string
  prescribedBy: string
  dosage: string
  timesPerDay: number
  timesOfDay: string[]
  startDate: string
  endDate?: string
}

export type UpdateMedicationPayload = CreateMedicationPayload

export const MEDICATIONS_API = {
  list: "/medications",
  create: "/medications",
  update: (id: string) => `/medications/${id}`,
  delete: (id: string) => `/medications/${id}`,
} as const

export const MEDICATIONS_QUERY_KEYS = {
  list: ["medications", "list"] as const,
}
