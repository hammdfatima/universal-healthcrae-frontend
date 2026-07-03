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

export const PATIENT_SETTINGS_API = {
  get: "/settings",
  updateProfile: "/settings/profile",
  updateAccount: "/settings/account",
  changePassword: "/settings/change-password",
} as const

export const PATIENT_SETTINGS_QUERY_KEYS = {
  settings: ["patient", "settings"] as const,
}
