import axios from "axios"

import type { AccountSettings } from "@/app/(dashboards)/patient/_lib/settings"
import type {
  CompleteOnboardingPayload,
  PatientProfileResponse,
} from "@/lib/api/patient-profile"
import { getApiBaseUrl } from "@/lib/api-base"
import { buildRequestUrl } from "@/lib/utils"

export type PatientSettings = {
  profile: PatientProfileResponse
  account: AccountSettings
}

export type UpdateProfilePayload = CompleteOnboardingPayload

export type UpdateAccountPayload = AccountSettings

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
}

export type DeleteAccountPayload = {
  confirmation: "DELETE"
  /** HIPAA §2.4: required step-up token from POST /auth/step-up/verify. */
  stepUpToken: string
}

export type AuthSession = {
  id: string
  sessionId: string
  ip: string | null
  userAgent: string | null
  lastSeenAt: string
  createdAt: string
  isCurrent: boolean
}

export type AuthSessionsList = {
  sessions: AuthSession[]
}

export type PatientDataExport = {
  exportedAt: string
  profile: Record<string, unknown>
  medications: Record<string, unknown>[]
  allergies: Record<string, unknown>[]
  healthHistory: Record<string, unknown>[]
  vaccinations: Record<string, unknown>[]
  labResults: Record<string, unknown>[]
  imagingResults: Record<string, unknown>[]
  careProviders: Record<string, unknown>[]
  pharmacies: Record<string, unknown>[]
  familyLifestyleHistory: Record<string, unknown>
  familyMembers: Record<string, unknown>[]
}

export const PATIENT_SETTINGS_API = {
  get: "/settings",
  updateProfile: "/settings/profile",
  updateAccount: "/settings/account",
  changePassword: "/settings/change-password",
  exportData: "/settings/export",
  deleteAccount: "/settings/delete-account",
  sessions: "/settings/sessions",
  revokeSession: (sessionId: string) =>
    `/settings/sessions/${encodeURIComponent(sessionId)}`,
} as const

export const PATIENT_SETTINGS_QUERY_KEYS = {
  settings: ["patient", "settings"] as const,
  sessions: ["patient", "settings", "sessions"] as const,
}

export async function revokeAuthSession(sessionId: string) {
  await axios.delete(
    buildRequestUrl(
      getApiBaseUrl(),
      PATIENT_SETTINGS_API.revokeSession(sessionId)
    ),
    { withCredentials: true }
  )
}

/**
 * "Log out other devices" (HIPAA §2.5). There is no single backend endpoint
 * for this yet, so we revoke every non-current session individually.
 */
export async function revokeOtherAuthSessions(sessions: AuthSession[]) {
  const others = sessions.filter((session) => !session.isCurrent)
  await Promise.all(
    others.map((session) => revokeAuthSession(session.sessionId))
  )
}
