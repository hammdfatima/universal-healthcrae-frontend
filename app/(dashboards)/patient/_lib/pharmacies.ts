import { z } from "zod"

import type { Pharmacy } from "@/lib/api/pharmacies"

export type { Pharmacy }

export const pharmacySchema = z.object({
  name: z.string().min(1, "Pharmacy name is required."),
  phone: z.string().min(1, "Phone number is required."),
  address: z.string().min(1, "Address is required."),
  notes: z.string(),
})

export type PharmacyFormValues = z.infer<typeof pharmacySchema>

export const pharmacyDefaultValues: PharmacyFormValues = {
  name: "",
  phone: "",
  address: "",
  notes: "",
}

export function getPharmacyInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toUpperCase()
}

export function pharmacyToFormValues(pharmacy: Pharmacy): PharmacyFormValues {
  return {
    name: pharmacy.name,
    phone: pharmacy.phone,
    address: pharmacy.address ?? "",
    notes: pharmacy.notes ?? "",
  }
}

export function formValuesToPayload(values: PharmacyFormValues) {
  return {
    name: values.name.trim(),
    phone: values.phone.trim(),
    address: values.address.trim(),
    notes: values.notes.trim(),
  }
}

export function truncateAddress(address: string | null, max = 48): string {
  if (!address?.trim()) return "—"
  if (address.length <= max) return address
  return `${address.slice(0, max).trim()}…`
}
