import type { LucideIcon } from "lucide-react"
import { Activity, AlertTriangle, FolderOpen, Syringe } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"

import { healthCounts } from "@/app/(dashboards)/patient/_lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

type StatCard = {
  label: string
  value: number
  detail: string
  href: Route
  icon: LucideIcon
  accent: string
  iconBg: string
}

const stats: StatCard[] = [
  {
    label: "Medications",
    value: healthCounts.medications,
    detail: "Active prescriptions",
    href: "/patient/medications" as Route,
    icon: Activity,
    accent: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/15 text-primary",
  },
  {
    label: "Allergies",
    value: healthCounts.allergies,
    detail: "Known sensitivities",
    href: "/patient/allergies" as Route,
    icon: AlertTriangle,
    accent: "from-destructive/15 to-destructive/5",
    iconBg: "bg-destructive/10 text-destructive",
  },
  {
    label: "Vaccinations",
    value: healthCounts.vaccinations,
    detail: "Immunization records",
    href: "/patient/vaccinations" as Route,
    icon: Syringe,
    accent: "from-secondary/20 to-secondary/5",
    iconBg: "bg-secondary/15 text-secondary",
  },
  {
    label: "Documents",
    value: healthCounts.documents,
    detail: "Files in your vault",
    href: "/patient/documents" as Route,
    icon: FolderOpen,
    accent: "from-blue-500/15 to-blue-500/5",
    iconBg: "bg-blue-100 text-blue-700",
  },
]

export default function HealthStatsGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(
        ({ label, value, detail, href, icon: Icon, accent, iconBg }) => (
          <li key={label}>
            <Link href={href} className="group block h-full">
              <Card className="h-full overflow-hidden border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                <CardContent
                  className={cn(
                    "relative flex items-center gap-4 bg-gradient-to-br p-5",
                    accent
                  )}
                >
                  <span
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105",
                      iconBg
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <Typography variant="muted" className="text-sm">
                      {label}
                    </Typography>
                    <Typography
                      as="p"
                      variant="h3"
                      className="mt-0.5 leading-tight"
                    >
                      {value}
                    </Typography>
                    <Typography variant="muted" className="text-xs">
                      {detail}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </li>
        )
      )}
    </ul>
  )
}
