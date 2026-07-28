export type BreachIncident = {
  id: string
  title: string
  summary: string
  status: "open" | "contained" | "closed"
  affectedCountEst: number
  dataCategories: string[]
  detectedAt: string
  hipaa60dDeadline: string
  createdByUserId: string | null
  createdAt: string
  updatedAt: string
}

export type BreachIncidentsList = {
  incidents: BreachIncident[]
}

export const ADMIN_BREACH_INCIDENTS_API = {
  list: "/admin/breach-incidents",
  create: "/admin/breach-incidents",
  update: (id: string) => `/admin/breach-incidents/${id}`,
  delete: (id: string) => `/admin/breach-incidents/${id}`,
} as const

export const ADMIN_BREACH_INCIDENTS_QUERY_KEYS = {
  list: ["admin", "breach-incidents"] as const,
}
