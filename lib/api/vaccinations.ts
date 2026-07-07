export type Vaccination = {
  id: string
  vaccineName: string
  prescribedBy: string
  administeredBy: string
  dosage: string
  date: string
  time: string
  createdAt: string
  updatedAt: string
}

export type VaccinationsListResponse = {
  vaccinations: Vaccination[]
}

export type CreateVaccinationPayload = {
  vaccineName: string
  prescribedBy: string
  administeredBy: string
  dosage: string
  date: string
  time: string
}

export type UpdateVaccinationPayload = CreateVaccinationPayload

export const VACCINATIONS_API = {
  list: "/vaccinations",
  create: "/vaccinations",
  update: (id: string) => `/vaccinations/${id}`,
  delete: (id: string) => `/vaccinations/${id}`,
} as const

export const VACCINATIONS_QUERY_KEYS = {
  list: ["vaccinations", "list"] as const,
}
