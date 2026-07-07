import type { PatientDataExport } from "@/lib/api/patient-settings"

export type EmergencyAccessToken = {
  token: string
  accessUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastAccessedAt: string | null
}

export type EmergencyAccessStatus = {
  hasToken: boolean
  access: EmergencyAccessToken | null
}

export type PublicEmergencyRecords = PatientDataExport & {
  patientName: string
  accessedAt: string
}

export const EMERGENCY_ACCESS_API = {
  status: "/emergency-access",
  generate: "/emergency-access/generate",
  revoke: "/emergency-access",
  publicRecords: (token: string) => `/emergency-access/public/${token}`,
} as const

export const EMERGENCY_ACCESS_QUERY_KEYS = {
  status: ["emergency-access", "status"] as const,
  publicRecords: (token: string) =>
    ["emergency-access", "public", token] as const,
}
