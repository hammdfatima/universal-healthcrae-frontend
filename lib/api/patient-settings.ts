import type { AccountSettings } from "@/app/(dashboards)/patient/_lib/settings"
import type {
  CompleteOnboardingPayload,
  PatientProfileResponse,
} from "@/lib/api/patient-profile"

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
  familyMembers: Record<string, unknown>[]
}

export const PATIENT_SETTINGS_API = {
  get: "/settings",
  updateProfile: "/settings/profile",
  updateAccount: "/settings/account",
  changePassword: "/settings/change-password",
  exportData: "/settings/export",
  deleteAccount: "/settings/delete-account",
} as const

export const PATIENT_SETTINGS_QUERY_KEYS = {
  settings: ["patient", "settings"] as const,
}
