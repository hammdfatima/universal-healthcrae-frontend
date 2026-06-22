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

import { healthCounts } from "@/app/(dashboards)/patient/_lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

type QuickLink = {
  label: string
  href: Route
  icon: LucideIcon
  count?: number
}

const vaultLinks: QuickLink[] = [
  {
    label: "Medications",
    href: "/patient/medications" as Route,
    icon: Activity,
    count: healthCounts.medications,
  },
  {
    label: "Allergies",
    href: "/patient/allergies" as Route,
    icon: AlertTriangle,
    count: healthCounts.allergies,
  },
  {
    label: "Health History",
    href: "/patient/medical-history" as Route,
    icon: History,
  },
  {
    label: "Immunizations",
    href: "/patient/vaccinations" as Route,
    icon: Syringe,
    count: healthCounts.vaccinations,
  },
  {
    label: "Laboratory",
    href: "/patient/lab" as Route,
    icon: FlaskConical,
    count: healthCounts.labResults,
  },
  {
    label: "Imaging",
    href: "/patient/imaging" as Route,
    icon: ScanLine,
    count: healthCounts.radiology,
  },
]

export default function QuickAccessCard() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Medical Vault</CardTitle>
        <Typography variant="muted" className="text-sm">
          Quick access to your health records
        </Typography>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 sm:grid-cols-2">
          {vaultLinks.map(({ label, href, icon: Icon, count }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 px-3 py-3 text-sm font-medium transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-card shadow-sm">
                  <Icon className="size-4 text-secondary" aria-hidden />
                </span>
                <span className="flex-1">{label}</span>
                {count !== undefined ? (
                  <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary tabular-nums">
                    {count}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
