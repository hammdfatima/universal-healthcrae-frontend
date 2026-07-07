import { z } from "zod"

import type { CareProvider } from "@/lib/api/care-providers"

export type { CareProvider }

export const careProviderSchema = z.object({
  name: z.string().min(1, "Provider name is required."),
  phone: z.string().min(1, "Phone number is required."),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .or(z.literal("")),
  clinicDetails: z.string(),
})

export type CareProviderFormValues = z.infer<typeof careProviderSchema>

export const careProviderDefaultValues: CareProviderFormValues = {
  name: "",
  phone: "",
  email: "",
  clinicDetails: "",
}

export function getProviderInitials(name: string): string {
  const parts = name
    .replace(/^dr\.?\s+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toUpperCase()
}

export function careProviderToFormValues(
  provider: CareProvider
): CareProviderFormValues {
  return {
    name: provider.name,
    phone: provider.phone,
    email: provider.email ?? "",
    clinicDetails: provider.clinicDetails ?? "",
  }
}

export function formValuesToPayload(values: CareProviderFormValues) {
  return {
    name: values.name.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    clinicDetails: values.clinicDetails.trim(),
  }
}

export function formatOptionalEmail(email: string | null): string {
  return email?.trim() || "—"
}

export function truncateClinicDetails(
  details: string | null,
  max = 48
): string {
  if (!details?.trim()) return "—"
  if (details.length <= max) return details
  return `${details.slice(0, max).trim()}…`
}

export function getProviderSubtitle(provider: CareProvider): string {
  if (provider.clinicDetails?.trim()) {
    return (
      provider.clinicDetails.split("·")[0]?.trim() || provider.clinicDetails
    )
  }
  return provider.phone
}
