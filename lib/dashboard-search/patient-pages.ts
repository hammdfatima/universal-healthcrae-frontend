import {
  Activity,
  AlertTriangle,
  FlaskConical,
  History,
  LayoutDashboard,
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
    "page-medications",
    "Medications",
    "/patient/medications",
    "Pages",
    Activity,
    ["prescriptions", "medicine", "drugs"]
  ),
  pageResult(
    "page-allergies",
    "Known Allergies",
    "/patient/allergies",
    "Pages",
    AlertTriangle,
    ["allergy", "reactions"]
  ),
  pageResult(
    "page-health-history",
    "Health History",
    "/patient/health-history",
    "Pages",
    History,
    ["conditions", "illness", "diagnosis"]
  ),
  pageResult(
    "page-vaccinations",
    "Immunizations",
    "/patient/vaccinations",
    "Pages",
    Syringe,
    ["vaccines", "shots"]
  ),
  pageResult("page-lab", "Laboratory", "/patient/lab", "Pages", FlaskConical, [
    "lab results",
    "tests",
    "reports",
    "documents",
  ]),
  pageResult("page-imaging", "Imaging", "/patient/imaging", "Pages", ScanLine, [
    "scans",
    "x-ray",
    "ct",
    "mri",
    "documents",
  ]),
  pageResult(
    "page-medical-vault",
    "Medical Vault",
    "/patient/medications",
    "Pages",
    Shield,
    ["records", "health data"]
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
