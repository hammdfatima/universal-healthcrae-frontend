export type Allergy = {
  id: string
  allergyType: string
  nature: string
  symptoms: string[]
  triggers: string[]
  createdAt: string
  updatedAt: string
}

export type AllergiesListResponse = {
  allergies: Allergy[]
}

export type CreateAllergyPayload = {
  allergyType: string
  nature: string
  symptoms: string[]
  triggers: string[]
}

export type UpdateAllergyPayload = CreateAllergyPayload

export const ALLERGIES_API = {
  list: "/allergies",
  create: "/allergies",
  update: (id: string) => `/allergies/${id}`,
  delete: (id: string) => `/allergies/${id}`,
} as const

export const ALLERGIES_QUERY_KEYS = {
  list: ["allergies", "list"] as const,
}
