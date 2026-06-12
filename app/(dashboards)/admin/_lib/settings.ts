import { z } from "zod"

export type AdminProfile = {
  name: string
  email: string
  phone: string
}

export const adminProfileSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(1, "Phone number is required."),
})

export type AdminProfileFormValues = z.infer<typeof adminProfileSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "Password must be at least 8 characters."),
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

export const initialAdminProfile: AdminProfile = {
  name: "Admin User",
  email: "admin@uhc.com",
  phone: "(555) 000-1000",
}

export const ADMIN_PROFILE_STORAGE_KEY = "uhc-admin-profile"

export function getAdminProfileFromStorage(): AdminProfile {
  if (typeof window === "undefined") return initialAdminProfile

  try {
    const stored = localStorage.getItem(ADMIN_PROFILE_STORAGE_KEY)
    if (!stored) return initialAdminProfile
    return { ...initialAdminProfile, ...(JSON.parse(stored) as AdminProfile) }
  } catch {
    return initialAdminProfile
  }
}

export function saveAdminProfileToStorage(profile: AdminProfile) {
  localStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(profile))
}
