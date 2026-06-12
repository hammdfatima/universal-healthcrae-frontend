import {
  type Allergy,
  getAllergiesFromStorage,
} from "@/app/(dashboards)/patient/_lib/allergies"
import {
  getHealthHistoryFromStorage,
  type HealthHistoryEntry,
} from "@/app/(dashboards)/patient/_lib/health-history"
import {
  getImagingResultsFromStorage,
  type ImagingResult,
} from "@/app/(dashboards)/patient/_lib/imaging"
import {
  getLabResultsFromStorage,
  type LabResult,
} from "@/app/(dashboards)/patient/_lib/lab"
import {
  getMedicationsFromStorage,
  type Medication,
} from "@/app/(dashboards)/patient/_lib/medications"
import {
  type CareProvider,
  getCareProvidersFromStorage,
} from "@/app/(dashboards)/patient/_lib/providers"
import {
  getProfileFromStorage,
  type PatientProfile,
} from "@/app/(dashboards)/patient/_lib/settings"
import {
  getVaccinationsFromStorage,
  type Vaccination,
} from "@/app/(dashboards)/patient/_lib/vaccinations"
import {
  getVitalsFromStorage,
  type PatientVitals,
} from "@/app/(dashboards)/patient/_lib/vitals"

export type MedicalRecordsSummary = {
  profile: PatientProfile
  medications: Medication[]
  allergies: Allergy[]
  healthHistory: HealthHistoryEntry[]
  vaccinations: Vaccination[]
  vitals: PatientVitals
  labResults: LabResult[]
  imagingResults: ImagingResult[]
  careProviders: CareProvider[]
}

export function getMedicalRecordsSummary(): MedicalRecordsSummary {
  return {
    profile: getProfileFromStorage(),
    medications: getMedicationsFromStorage(),
    allergies: getAllergiesFromStorage(),
    healthHistory: getHealthHistoryFromStorage(),
    vaccinations: getVaccinationsFromStorage(),
    vitals: getVitalsFromStorage(),
    labResults: getLabResultsFromStorage(),
    imagingResults: getImagingResultsFromStorage(),
    careProviders: getCareProvidersFromStorage(),
  }
}
