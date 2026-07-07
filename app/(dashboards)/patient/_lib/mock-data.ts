export const healthCounts = {
  medications: 4,
  allergies: 2,
  vaccinations: 6,
  documents: 8,
  labResults: 5,
  radiology: 3,
  familyMembers: 3,
} as const

export const recentMedications = [] as const

export const allergies = [] as const

export const recentVaccinations = [] as const

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

export const careProviders = [] as const
