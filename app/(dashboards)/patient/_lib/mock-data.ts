import { initialAllergies } from "@/app/(dashboards)/patient/_lib/allergies"
import { initialMedications } from "@/app/(dashboards)/patient/_lib/medications"
import {
  getProviderInitials,
  getProviderSubtitle,
  initialCareProviders,
} from "@/app/(dashboards)/patient/_lib/providers"
import { initialVaccinations } from "@/app/(dashboards)/patient/_lib/vaccinations"

export const healthCounts = {
  medications: 4,
  allergies: 2,
  vaccinations: 6,
  documents: 8,
  vitals: 12,
  labResults: 5,
  radiology: 3,
  familyMembers: 3,
} as const

export const recentMedications = initialMedications.map((medication) => ({
  ...medication,
  endDate: medication.endDate ?? "—",
}))

export const allergies = initialAllergies

export const recentVaccinations = initialVaccinations.slice(0, 3).map((vax) => ({
  id: vax.id,
  name: vax.vaccineName,
  date: vax.date,
  provider: vax.administeredBy,
}))

export const healthRecordsChartData = [
  {
    name: "Medications",
    value: healthCounts.medications,
    color: "hsl(158 100% 33%)",
  },
  { name: "Allergies", value: healthCounts.allergies, color: "hsl(0 84% 60%)" },
  {
    name: "Vaccinations",
    value: healthCounts.vaccinations,
    color: "hsl(160 100% 15%)",
  },
  { name: "Vitals", value: healthCounts.vitals, color: "hsl(197 37% 45%)" },
  {
    name: "Lab Results",
    value: healthCounts.labResults,
    color: "hsl(43 74% 55%)",
  },
  {
    name: "Radiology",
    value: healthCounts.radiology,
    color: "hsl(270 50% 55%)",
  },
] as const

export const careProviders = initialCareProviders.map((provider) => ({
  id: provider.id,
  name: provider.name,
  specialty: getProviderSubtitle(provider),
  initials: getProviderInitials(provider.name),
}))
