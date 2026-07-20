export const SHARED_MEDICAL_VAULT_SECTIONS = [
  "Medications",
  "Allergies",
  "Health History",
  "Immunizations",
  "Laboratory",
  "Imaging",
  "Preferred Pharmacies",
  "Family & Lifestyle History",
  "Care Providers",
  "Emergency Contacts",
] as const

export const SHARED_MEDICAL_VAULT_SECTIONS_TEXT =
  SHARED_MEDICAL_VAULT_SECTIONS.join(", ")
