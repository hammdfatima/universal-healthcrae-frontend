export type CareProvider = {
  id: string
  name: string
  phone: string
  email: string | null
  clinicDetails: string | null
  createdAt: string
  updatedAt: string
}

export type CareProvidersListResponse = {
  providers: CareProvider[]
}

export type CreateCareProviderPayload = {
  name: string
  phone: string
  email?: string
  clinicDetails?: string
}

export type UpdateCareProviderPayload = CreateCareProviderPayload

export const CARE_PROVIDERS_API = {
  list: "/care-providers",
  create: "/care-providers",
  update: (id: string) => `/care-providers/${id}`,
  delete: (id: string) => `/care-providers/${id}`,
} as const

export const CARE_PROVIDERS_QUERY_KEYS = {
  list: ["care-providers", "list"] as const,
}
