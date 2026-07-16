"use client"

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
import Link from "next/link"
import { useMemo } from "react"

import {
  type HealthRecordTab,
  healthRecordHref,
} from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import {
  type MedicalVaultCounts,
  useMedicalVaultCounts,
} from "@/app/(dashboards)/patient/_lib/use-medical-vault-counts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

type QuickLinkConfig = {
  countKey: keyof MedicalVaultCounts
  label: string
  tab: HealthRecordTab
  icon: LucideIcon
}

const vaultLinkConfig: QuickLinkConfig[] = [
  {
    countKey: "medications",
    label: "Medications",
    tab: "medications",
    icon: Activity,
  },
  {
    countKey: "allergies",
    label: "Allergies",
    tab: "allergies",
    icon: AlertTriangle,
  },
  {
    countKey: "healthHistory",
    label: "Health History",
    tab: "health-history",
    icon: History,
  },
  {
    countKey: "vaccinations",
    label: "Immunizations",
    tab: "immunizations",
    icon: Syringe,
  },
  {
    countKey: "labResults",
    label: "Laboratory",
    tab: "laboratory",
    icon: FlaskConical,
  },
  {
    countKey: "imagingResults",
    label: "Imaging",
    tab: "imaging",
    icon: ScanLine,
  },
]

export default function QuickAccessCard() {
  const { counts } = useMedicalVaultCounts()

  const vaultLinks = useMemo(
    () =>
      vaultLinkConfig.map((link) => ({
        ...link,
        href: healthRecordHref(link.tab),
        count: counts[link.countKey],
      })),
    [counts]
  )

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Health Record</CardTitle>
        <Typography variant="muted" className="text-sm">
          Quick access to your health records
        </Typography>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 sm:grid-cols-2">
          {vaultLinks.map(({ label, href, icon: Icon, count }) => (
            <li key={href as string}>
              <Link
                href={href as Route}
                className="flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 px-3 py-3 text-sm font-medium transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-card shadow-sm">
                  <Icon className="size-4 text-secondary" aria-hidden />
                </span>
                <span className="flex-1">{label}</span>
                <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary tabular-nums">
                  {count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
