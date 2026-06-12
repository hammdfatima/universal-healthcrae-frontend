import { z } from "zod"

export type CareProvider = {
  id: string
  name: string
  phone: string
  email: string
  clinicDetails: string
}

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

export const initialCareProviders: CareProvider[] = [
  {
    id: "1",
    name: "Dr. Brooklyn Belle",
    phone: "(555) 214-8890",
    email: "brooklyn.belle@uhcclinic.com",
    clinicDetails: "UHC Internal Medicine · 1200 Wellness Ave, Suite 300",
  },
  {
    id: "2",
    name: "Dr. John Richards",
    phone: "(555) 903-4412",
    email: "john.richards@heartcare.com",
    clinicDetails: "HeartCare Associates · 88 Riverside Blvd",
  },
  {
    id: "3",
    name: "Dr. Jane Mitchell",
    phone: "(555) 778-1204",
    email: "",
    clinicDetails: "Family Health Center · 45 Oak Street",
  },
]

export const CARE_PROVIDERS_STORAGE_KEY = "uhc-care-providers"

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

export function getCareProvidersFromStorage(): CareProvider[] {
  if (typeof window === "undefined") return initialCareProviders

  try {
    const stored = localStorage.getItem(CARE_PROVIDERS_STORAGE_KEY)
    if (!stored) return initialCareProviders
    return JSON.parse(stored) as CareProvider[]
  } catch {
    return initialCareProviders
  }
}

export function saveCareProvidersToStorage(providers: CareProvider[]) {
  localStorage.setItem(CARE_PROVIDERS_STORAGE_KEY, JSON.stringify(providers))
}

export function getCareProviderById(id: string): CareProvider | undefined {
  return getCareProvidersFromStorage().find((provider) => provider.id === id)
}

export function careProviderToFormValues(
  provider: CareProvider
): CareProviderFormValues {
  return {
    name: provider.name,
    phone: provider.phone,
    email: provider.email,
    clinicDetails: provider.clinicDetails,
  }
}

export function formValuesToCareProvider(
  values: CareProviderFormValues,
  id: string
): CareProvider {
  return {
    id,
    name: values.name.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    clinicDetails: values.clinicDetails.trim(),
  }
}

export function formatOptionalEmail(email: string): string {
  return email.trim() || "—"
}

export function truncateClinicDetails(details: string, max = 48): string {
  if (!details.trim()) return "—"
  if (details.length <= max) return details
  return `${details.slice(0, max).trim()}…`
}

export function getProviderSubtitle(provider: CareProvider): string {
  if (provider.clinicDetails.trim()) {
    return (
      provider.clinicDetails.split("·")[0]?.trim() || provider.clinicDetails
    )
  }
  return provider.phone
}
