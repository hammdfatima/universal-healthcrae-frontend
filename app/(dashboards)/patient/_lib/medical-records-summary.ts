import type { PatientProfile } from "@/app/(dashboards)/patient/_lib/settings"
import type { Allergy } from "@/lib/api/allergies"
import type { CareProvider } from "@/lib/api/care-providers"
import type { HealthHistoryEntry } from "@/lib/api/health-history"
import type { Medication } from "@/lib/api/medications"
import type { Vaccination } from "@/lib/api/vaccinations"

export type MedicalRecordsSummary = {
  profile: PatientProfile
  medications: Medication[]
  allergies: Allergy[]
  healthHistory: HealthHistoryEntry[]
  vaccinations: Vaccination[]
  careProviders: CareProvider[]
}

export function getMedicalRecordsSummary(
  profile: PatientProfile,
  careProviders: CareProvider[] = [],
  medications: Medication[] = [],
  allergies: Allergy[] = [],
  healthHistory: HealthHistoryEntry[] = [],
  vaccinations: Vaccination[] = []
): MedicalRecordsSummary {
  return {
    profile,
    medications,
    allergies,
    healthHistory,
    vaccinations,
    careProviders,
  }
}
