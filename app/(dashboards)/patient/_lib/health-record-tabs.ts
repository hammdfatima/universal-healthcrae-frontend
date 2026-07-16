import type { LucideIcon } from "lucide-react"
import {
  Activity,
  AlertTriangle,
  FlaskConical,
  History,
  ScanLine,
  Syringe,
} from "lucide-react"
import type { Route } from "next"

import type { MedicalVaultCounts } from "@/app/(dashboards)/patient/_lib/use-medical-vault-counts"

export const HEALTH_RECORD_TABS = [
  {
    id: "medications",
    label: "Medications",
    icon: Activity,
    countKey: "medications",
  },
  {
    id: "allergies",
    label: "Known Allergies",
    icon: AlertTriangle,
    countKey: "allergies",
  },
  {
    id: "health-history",
    label: "Health History",
    icon: History,
    countKey: "healthHistory",
  },
  {
    id: "immunizations",
    label: "Immunizations",
    icon: Syringe,
    countKey: "vaccinations",
  },
  {
    id: "laboratory",
    label: "Laboratory",
    icon: FlaskConical,
    countKey: "labResults",
  },
  {
    id: "imaging",
    label: "Imaging",
    icon: ScanLine,
    countKey: "imagingResults",
  },
] as const satisfies ReadonlyArray<{
  id: string
  label: string
  icon: LucideIcon
  countKey: keyof MedicalVaultCounts
}>

export type HealthRecordTab = (typeof HEALTH_RECORD_TABS)[number]["id"]

export const DEFAULT_HEALTH_RECORD_TAB: HealthRecordTab = "medications"

export const HEALTH_RECORD_RELATED_PATHS = [
  "/patient/health-record",
  "/patient/medications",
  "/patient/allergies",
  "/patient/health-history",
  "/patient/vaccinations",
  "/patient/lab",
  "/patient/imaging",
] as const

export function isHealthRecordTab(
  value: string | null | undefined
): value is HealthRecordTab {
  return HEALTH_RECORD_TABS.some((tab) => tab.id === value)
}

export function healthRecordHref(tab?: HealthRecordTab | null): Route {
  if (!tab || tab === DEFAULT_HEALTH_RECORD_TAB) {
    return "/patient/health-record" as Route
  }

  return `/patient/health-record?tab=${tab}` as Route
}

export function isHealthRecordPath(pathname: string): boolean {
  return HEALTH_RECORD_RELATED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}
