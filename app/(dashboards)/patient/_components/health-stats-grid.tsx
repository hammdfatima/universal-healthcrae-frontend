"use client"

import type { LucideIcon } from "lucide-react"
import { Activity, AlertTriangle, FolderOpen, Syringe } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { Card, CardContent } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  type DashboardStatsResponse,
  PATIENT_DASHBOARD_API,
  PATIENT_DASHBOARD_QUERY_KEYS,
} from "@/lib/api/patient-dashboard"
import { cn } from "@/lib/utils"

type StatCard = {
  label: string
  countKey: keyof DashboardStatsResponse["counts"]
  detail: string
  href: Route
  icon: LucideIcon
  accent: string
  iconBg: string
}

const statCards: StatCard[] = [
  {
    label: "Medications",
    countKey: "medications",
    detail: "Active prescriptions",
    href: healthRecordHref("medications"),
    icon: Activity,
    accent: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/15 text-primary",
  },
  {
    label: "Allergies",
    countKey: "allergies",
    detail: "Known sensitivities",
    href: healthRecordHref("allergies"),
    icon: AlertTriangle,
    accent: "from-destructive/15 to-destructive/5",
    iconBg: "bg-destructive/10 text-destructive",
  },
  {
    label: "Vaccinations",
    countKey: "vaccinations",
    detail: "Immunization records",
    href: healthRecordHref("immunizations"),
    icon: Syringe,
    accent: "from-secondary/20 to-secondary/5",
    iconBg: "bg-secondary/15 text-secondary",
  },
  {
    label: "Documents",
    countKey: "documents",
    detail: "Lab & imaging files",
    href: healthRecordHref("laboratory"),
    icon: FolderOpen,
    accent: "from-blue-500/15 to-blue-500/5",
    iconBg: "bg-blue-100 text-blue-700",
  },
]

export default function HealthStatsGrid() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<DashboardStatsResponse>({
      path: PATIENT_DASHBOARD_API.stats,
      queryKey: PATIENT_DASHBOARD_QUERY_KEYS.stats,
    })

  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="py-10">
          <Loader label="Loading dashboard stats..." />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <ErrorCard
        error={error}
        onRetry={() => refetch()}
        isLoading={isFetching}
      />
    )
  }

  const counts = data?.counts

  if (!counts) {
    return (
      <EmptyCard
        title="No dashboard stats"
        description="We could not load your health record counts."
      />
    )
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map(
        ({ label, countKey, detail, href, icon: Icon, accent, iconBg }) => (
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
                      {counts[countKey]}
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
