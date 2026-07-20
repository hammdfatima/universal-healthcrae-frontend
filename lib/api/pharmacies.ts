export type Pharmacy = {
  id: string
  name: string
  phone: string
  address: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type PharmaciesListResponse = {
  pharmacies: Pharmacy[]
}

export type CreatePharmacyPayload = {
  name: string
  phone: string
  address: string
  notes?: string
}

export type UpdatePharmacyPayload = CreatePharmacyPayload

export const PHARMACIES_API = {
  list: "/pharmacies",
  create: "/pharmacies",
  update: (id: string) => `/pharmacies/${id}`,
  delete: (id: string) => `/pharmacies/${id}`,
} as const

export const PHARMACIES_QUERY_KEYS = {
  list: ["pharmacies", "list"] as const,
}
