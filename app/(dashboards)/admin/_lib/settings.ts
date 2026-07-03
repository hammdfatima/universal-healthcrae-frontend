import { z } from "zod"

export type AdminProfile = {
  id: string
  name: string
  email: string
  phone: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export type AdminProfilePayload = {
  name: string
  email: string
  phone: string
}

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
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

export function toProfileFormValues(
  profile: AdminProfile
): AdminProfileFormValues {
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? "",
  }
}
