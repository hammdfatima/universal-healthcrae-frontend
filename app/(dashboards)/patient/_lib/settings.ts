import { z } from "zod"

import { strongPasswordSchema } from "@/lib/auth/password"

export const bloodGroupOptions = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
  { label: "Unknown", value: "Unknown" },
] as const

export const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
  { label: "Prefer not to say", value: "Prefer not to say" },
] as const

export type PatientProfile = {
  firstName: string
  lastName: string
  email: string
  phone: string
  profileImage: string
  bloodGroup: string
  gender: string
  address: string
}

export type SubscriptionInfo = {
  planName: string
  price: string
  billingCycle: string
  nextBillingDate: string
  status: "active" | "cancelled"
}

export type AccountSettings = {
  emailNotifications: boolean
  inAppNotifications: boolean
}

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(1, "Phone number is required."),
  profileImage: z.string(),
  bloodGroup: z.string().min(1, "Blood group is required."),
  gender: z.string(),
  address: z.string(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from your current password.",
    path: ["newPassword"],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export const initialProfile: PatientProfile = {
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@email.com",
  phone: "(555) 123-4567",
  profileImage: "",
  bloodGroup: "O+",
  gender: "Male",
  address: "123 Wellness Street, Health City",
}

export function profileToFormValues(
  profile: PatientProfile
): ProfileFormValues {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    profileImage: profile.profileImage,
    bloodGroup: profile.bloodGroup,
    gender: profile.gender,
    address: profile.address,
  }
}

export function formValuesToProfile(values: ProfileFormValues): PatientProfile {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    profileImage: values.profileImage,
    bloodGroup: values.bloodGroup,
    gender: values.gender,
    address: values.address.trim(),
  }
}

export const initialSubscription: SubscriptionInfo = {
  planName: "Individual Plan",
  price: "$9.95",
  billingCycle: "Monthly",
  nextBillingDate: "Jul 12, 2026",
  status: "active",
}

export const initialAccountSettings: AccountSettings = {
  emailNotifications: true,
  inAppNotifications: true,
}

export const PROFILE_STORAGE_KEY = "uhc-patient-profile"
export const SUBSCRIPTION_STORAGE_KEY = "uhc-patient-subscription"
export const ACCOUNT_SETTINGS_STORAGE_KEY = "uhc-patient-account-settings"
export const ONBOARDING_COMPLETE_KEY = "uhc-patient-onboarding-complete"

export function createProfileFromSignup(data: {
  firstName: string
  lastName: string
  email: string
}): PatientProfile {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    phone: "",
    profileImage: "",
    bloodGroup: "",
    gender: "",
    address: "",
  }
}

export function isOnboardingComplete(): boolean {
  if (typeof window === "undefined") return false

  try {
    return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === "true"
  } catch {
    return false
  }
}

export function markOnboardingComplete() {
  localStorage.setItem(ONBOARDING_COMPLETE_KEY, "true")
}

export function resetOnboardingStatus() {
  localStorage.removeItem(ONBOARDING_COMPLETE_KEY)
}

export function getProfileFromStorage(): PatientProfile {
  if (typeof window === "undefined") return initialProfile

  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!stored) return initialProfile
    const parsed = JSON.parse(stored) as PatientProfile & {
      dateOfBirth?: unknown
    }
    delete parsed.dateOfBirth
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(parsed))
    return { ...initialProfile, ...parsed }
  } catch {
    return initialProfile
  }
}

export function saveProfileToStorage(profile: PatientProfile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

export function getSubscriptionFromStorage(): SubscriptionInfo {
  if (typeof window === "undefined") return initialSubscription

  try {
    const stored = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY)
    if (!stored) return initialSubscription
    return JSON.parse(stored) as SubscriptionInfo
  } catch {
    return initialSubscription
  }
}

export function saveSubscriptionToStorage(subscription: SubscriptionInfo) {
  localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscription))
}

export function getAccountSettingsFromStorage(): AccountSettings {
  if (typeof window === "undefined") return initialAccountSettings

  try {
    const stored = localStorage.getItem(ACCOUNT_SETTINGS_STORAGE_KEY)
    if (!stored) return initialAccountSettings
    return JSON.parse(stored) as AccountSettings
  } catch {
    return initialAccountSettings
  }
}

export function saveAccountSettingsToStorage(settings: AccountSettings) {
  localStorage.setItem(ACCOUNT_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

export function getProfileDisplayName(
  profile: Pick<PatientProfile, "firstName" | "lastName">
): string {
  return `${profile.firstName} ${profile.lastName}`.trim()
}
