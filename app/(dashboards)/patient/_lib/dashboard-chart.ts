import type { DashboardCounts } from "@/lib/api/patient-dashboard"

export type VaultChartItem = {
  name: string
  value: number
  color: string
}

const VAULT_CHART_COLORS = {
  medications: "hsl(158 100% 33%)",
  allergies: "hsl(0 84% 60%)",
  vaccinations: "hsl(160 100% 15%)",
  labResults: "hsl(43 74% 55%)",
  imagingResults: "hsl(270 50% 55%)",
} as const

export function buildVaultChartData(counts: DashboardCounts): VaultChartItem[] {
  return [
    {
      name: "Medications",
      value: counts.medications,
      color: VAULT_CHART_COLORS.medications,
    },
    {
      name: "Allergies",
      value: counts.allergies,
      color: VAULT_CHART_COLORS.allergies,
    },
    {
      name: "Vaccinations",
      value: counts.vaccinations,
      color: VAULT_CHART_COLORS.vaccinations,
    },
    {
      name: "Lab Results",
      value: counts.labResults,
      color: VAULT_CHART_COLORS.labResults,
    },
    {
      name: "Imaging",
      value: counts.imagingResults,
      color: VAULT_CHART_COLORS.imagingResults,
    },
  ].filter((item) => item.value > 0)
}

export function getVaultChartTotal(counts: DashboardCounts): number {
  return (
    counts.medications +
    counts.allergies +
    counts.vaccinations +
    counts.labResults +
    counts.imagingResults
  )
}
