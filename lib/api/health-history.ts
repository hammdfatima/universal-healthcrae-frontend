export type HealthHistoryEntry = {
  id: string
  illnessName: string
  diagnosisDate: string
  prescribedBy: string
  details: string
  createdAt: string
  updatedAt: string
}

export type HealthHistoryListResponse = {
  entries: HealthHistoryEntry[]
}

export type CreateHealthHistoryPayload = {
  illnessName: string
  diagnosisDate: string
  prescribedBy: string
  details: string
}

export type UpdateHealthHistoryPayload = CreateHealthHistoryPayload

export const HEALTH_HISTORY_API = {
  list: "/health-history",
  create: "/health-history",
  update: (id: string) => `/health-history/${id}`,
  delete: (id: string) => `/health-history/${id}`,
} as const

export const HEALTH_HISTORY_QUERY_KEYS = {
  list: ["health-history", "list"] as const,
}
