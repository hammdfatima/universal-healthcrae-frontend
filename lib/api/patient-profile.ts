import type { PatientProfile } from "@/app/(dashboards)/patient/_lib/settings"

export type PatientProfileResponse = {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  phone: string | null
  profileImage: string | null
  bloodGroup: string | null
  gender: string | null
  address: string | null
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

export type CompleteOnboardingPayload = {
  firstName: string
  lastName: string
  phone: string
  profileImage?: string
  bloodGroup: string
  gender: string
  address: string
}

export const PATIENT_PROFILE_API = {
  get: "/profile",
  completeOnboarding: "/profile/onboarding",
} as const

export const PATIENT_PROFILE_QUERY_KEYS = {
  profile: ["patient", "profile"] as const,
}

export function apiProfileToPatientProfile(
  profile: PatientProfileResponse
): PatientProfile {
  return {
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    email: profile.email,
    phone: profile.phone ?? "",
    profileImage: profile.profileImage ?? "",
    bloodGroup: profile.bloodGroup ?? "",
    gender: profile.gender ?? "",
    address: profile.address ?? "",
  }
}

export function formValuesToOnboardingPayload(values: {
  firstName: string
  lastName: string
  phone: string
  profileImage: string
  bloodGroup: string
  gender: string
  address: string
}): CompleteOnboardingPayload {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    phone: values.phone.trim(),
    profileImage: values.profileImage.trim() || undefined,
    bloodGroup: values.bloodGroup,
    gender: values.gender,
    address: values.address.trim(),
  }
}

export function profileResponseToFormValues(profile: PatientProfileResponse) {
  return {
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    email: profile.email,
    phone: profile.phone ?? "",
    profileImage: profile.profileImage ?? "",
    bloodGroup: profile.bloodGroup ?? "",
    gender: profile.gender ?? "",
    address: profile.address ?? "",
  }
}
