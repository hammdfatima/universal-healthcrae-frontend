import {
  Activity,
  AlertTriangle,
  FlaskConical,
  History,
  LayoutDashboard,
  Pill,
  QrCode,
  ScanLine,
  Settings,
  Shield,
  Syringe,
  UserRound,
  Users,
} from "lucide-react"
import type { Route } from "next"

import type { PortalSearchResult } from "@/lib/dashboard-search/types"

function pageResult(
  id: string,
  title: string,
  href: Route,
  group: string,
  icon: PortalSearchResult["icon"],
  keywords: string[] = []
): PortalSearchResult {
  return {
    id,
    title,
    href,
    group,
    icon,
    keywords: [title, group, ...keywords].join(" ").toLowerCase(),
  }
}

export const PATIENT_SEARCH_PAGES: PortalSearchResult[] = [
  pageResult(
    "page-overview",
    "Overview",
    "/patient",
    "Pages",
    LayoutDashboard,
    ["dashboard", "home"]
  ),
  pageResult(
    "page-health-record",
    "Health Record",
    "/patient/health-record" as Route,
    "Pages",
    Shield,
    ["medical vault", "records", "health data"]
  ),
  pageResult(
    "page-medications",
    "Medications",
    "/patient/health-record?tab=medications" as Route,
    "Pages",
    Activity,
    ["prescriptions", "medicine", "drugs"]
  ),
  pageResult(
    "page-allergies",
    "Known Allergies",
    "/patient/health-record?tab=allergies" as Route,
    "Pages",
    AlertTriangle,
    ["allergy", "reactions"]
  ),
  pageResult(
    "page-health-history",
    "Health History",
    "/patient/health-record?tab=health-history" as Route,
    "Pages",
    History,
    ["conditions", "illness", "diagnosis"]
  ),
  pageResult(
    "page-vaccinations",
    "Immunizations",
    "/patient/health-record?tab=immunizations" as Route,
    "Pages",
    Syringe,
    ["vaccines", "shots"]
  ),
  pageResult(
    "page-lab",
    "Laboratory",
    "/patient/health-record?tab=laboratory" as Route,
    "Pages",
    FlaskConical,
    ["lab results", "tests", "reports", "documents"]
  ),
  pageResult(
    "page-imaging",
    "Imaging",
    "/patient/health-record?tab=imaging" as Route,
    "Pages",
    ScanLine,
    ["scans", "x-ray", "ct", "mri", "documents"]
  ),
  pageResult(
    "page-pharmacy",
    "Pharmacy",
    "/patient/health-record?tab=pharmacy" as Route,
    "Pages",
    Pill,
    ["preferred pharmacy", "prescriptions", "refills", "drugstore"]
  ),
  pageResult(
    "page-family-lifestyle",
    "Family & Lifestyle History",
    "/patient/health-record?tab=family-lifestyle" as Route,
    "Pages",
    Users,
    ["substance use", "family history", "social history", "hereditary"]
  ),
  pageResult(
    "page-care-providers",
    "Care Providers",
    "/patient/provider",
    "Pages",
    UserRound,
    ["doctors", "physicians", "clinic"]
  ),
  pageResult(
    "page-family-members",
    "Family Members",
    "/patient/family-members",
    "Pages",
    Users,
    ["family", "spouse", "emergency contact"]
  ),
  pageResult(
    "page-emergency-qr",
    "Emergency QR",
    "/patient/emergency-qr" as Route,
    "Pages",
    QrCode,
    ["qr code", "emergency access", "scan"]
  ),
  pageResult(
    "page-settings",
    "Settings",
    "/patient/settings",
    "Pages",
    Settings,
    ["profile", "account", "password", "subscription"]
  ),
]
