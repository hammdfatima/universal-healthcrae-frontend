export type DashboardCounts = {
  medications: number
  allergies: number
  vaccinations: number
  documents: number
  labResults: number
  imagingResults: number
}

export type DashboardStatsResponse = {
  counts: DashboardCounts
}

export const PATIENT_DASHBOARD_API = {
  stats: "/patient-dashboard/stats",
} as const

export const PATIENT_DASHBOARD_QUERY_KEYS = {
  stats: ["patient-dashboard", "stats"] as const,
}
