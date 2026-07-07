"use client"

import { CreditCard, Tags, TrendingUp, Users } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { Card, CardContent } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  ADMIN_DASHBOARD_API,
  ADMIN_DASHBOARD_QUERY_KEYS,
  type AdminDashboardStatsResponse,
} from "@/lib/api/admin-dashboard"
import { cn } from "@/lib/utils"

type StatCardConfig = {
  label: string
  getValue: (counts: AdminDashboardStatsResponse["counts"]) => string
  detail: string
  href: Route
  icon: typeof Users
  accent: string
  iconBg: string
}

const statCards: StatCardConfig[] = [
  {
    label: "Total Users",
    getValue: (counts) => counts.totalUsers.toLocaleString(),
    detail: "Registered accounts",
    href: "/admin/users" as Route,
    icon: Users,
    accent:
      "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20",
    iconBg: "bg-emerald-500/15 text-emerald-600",
  },
  {
    label: "Active Subscriptions",
    getValue: (counts) => counts.activeSubscriptions.toLocaleString(),
    detail: "Paying members",
    href: "/admin/subscription-plans" as Route,
    icon: Tags,
    accent:
      "from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20",
    iconBg: "bg-blue-500/15 text-blue-600",
  },
  {
    label: "Monthly Revenue",
    getValue: (counts) => counts.monthlyRevenue,
    detail: "Current billing cycle",
    href: "/admin/payments" as Route,
    icon: TrendingUp,
    accent:
      "from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20",
    iconBg: "bg-amber-500/15 text-amber-600",
  },
  {
    label: "Payments",
    getValue: (counts) => String(counts.paymentsThisMonth),
    detail: "Processed this month",
    href: "/admin/payments" as Route,
    icon: CreditCard,
    accent:
      "from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20",
    iconBg: "bg-violet-500/15 text-violet-600",
  },
]

export default function AdminStatsGrid() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<AdminDashboardStatsResponse>({
      path: ADMIN_DASHBOARD_API.stats,
      queryKey: ADMIN_DASHBOARD_QUERY_KEYS.stats,
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
        description="We could not load admin dashboard metrics."
      />
    )
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map(
        ({ label, getValue, detail, href, icon: Icon, accent, iconBg }) => (
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
                      {getValue(counts)}
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
