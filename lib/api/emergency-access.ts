import type { PatientDataExport } from "@/lib/api/patient-settings"

export type EmergencyAccessToken = {
  token: string
  accessUrl: string
  isActive: boolean
  expiresAt: string
  createdAt: string
  updatedAt: string
  lastAccessedAt: string | null
}

export type EmergencyAccessStatus = {
  hasToken: boolean
  access: EmergencyAccessToken | null
}

export type PublicEmergencyChallenge = {
  needsPin: true
  patientInitials: string
  expiresAt: string
}

export type PublicEmergencyRecords = PatientDataExport & {
  patientName: string
  accessedAt: string
}

export const EMERGENCY_ACCESS_API = {
  status: "/emergency-access",
  generate: "/emergency-access/generate",
  revoke: "/emergency-access",
  publicChallenge: (token: string) => `/emergency-access/public/${token}`,
  unlock: (token: string) => `/emergency-access/public/${token}/unlock`,
} as const

export const EMERGENCY_ACCESS_QUERY_KEYS = {
  status: ["emergency-access", "status"] as const,
  publicChallenge: (token: string) =>
    ["emergency-access", "challenge", token] as const,
}
