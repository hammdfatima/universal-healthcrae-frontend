"use client"

import { PieChart as PieChartIcon } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import {
  buildVaultChartData,
  getVaultChartTotal,
} from "@/app/(dashboards)/patient/_lib/dashboard-chart"
import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  type DashboardStatsResponse,
  PATIENT_DASHBOARD_API,
  PATIENT_DASHBOARD_QUERY_KEYS,
} from "@/lib/api/patient-dashboard"
import { cn } from "@/lib/utils"

const cardClassName = "flex h-full w-full flex-col border-border/60 shadow-sm"
const contentClassName = "flex flex-1 flex-col"

export default function HealthRecordsChart() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<DashboardStatsResponse>({
      path: PATIENT_DASHBOARD_API.stats,
      queryKey: PATIENT_DASHBOARD_QUERY_KEYS.stats,
    })

  if (isLoading) {
    return (
      <Card className={cardClassName}>
        <CardHeader className="pb-2">
          <CardTitle>Medical Vault Overview</CardTitle>
          <Typography variant="muted" className="text-sm">
            Distribution of your health records
          </Typography>
        </CardHeader>
        <CardContent
          className={cn(contentClassName, "items-center justify-center py-10")}
        >
          <Loader label="Loading chart..." />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className={cardClassName}>
        <CardHeader className="pb-2">
          <CardTitle>Medical Vault Overview</CardTitle>
        </CardHeader>
        <CardContent className={contentClassName}>
          <div className="flex flex-1 flex-col">
            <ErrorCard
              error={error}
              onRetry={() => refetch()}
              isLoading={isFetching}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  const counts = data?.counts

  if (!counts) {
    return (
      <Card className={cardClassName}>
        <CardHeader className="pb-2">
          <CardTitle>Medical Vault Overview</CardTitle>
        </CardHeader>
        <CardContent className={contentClassName}>
          <EmptyCard
            icon={PieChartIcon}
            title="No chart data"
            description="We could not load your medical vault distribution."
            className="h-full flex-1 border-none shadow-none"
          />
        </CardContent>
      </Card>
    )
  }

  const chartData = buildVaultChartData(counts)
  const total = getVaultChartTotal(counts)

  if (total === 0) {
    return (
      <Card className={cardClassName}>
        <CardHeader className="pb-2">
          <CardTitle>Medical Vault Overview</CardTitle>
          <Typography variant="muted" className="text-sm">
            Distribution of your health records
          </Typography>
        </CardHeader>
        <CardContent className={contentClassName}>
          <EmptyCard
            icon={PieChartIcon}
            title="No health records yet"
            description="Add medications, allergies, vaccinations, lab results, or imaging records to see your vault distribution."
            className="h-full flex-1 border-none shadow-none"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cardClassName}>
      <CardHeader className="pb-2">
        <CardTitle>Medical Vault Overview</CardTitle>
        <Typography variant="muted" className="text-sm">
          Distribution of your health records
        </Typography>
      </CardHeader>
      <CardContent className={contentClassName}>
        <div className="flex flex-1 flex-col items-center lg:flex-row lg:items-center lg:gap-8">
          <div className="relative h-56 w-full max-w-xs shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <Typography variant="muted" className="text-xs">
                Total records
              </Typography>
              <Typography as="p" variant="h3" className="leading-none">
                {total}
              </Typography>
            </div>
          </div>

          <ul className="mt-4 grid w-full flex-1 gap-2 sm:grid-cols-2 lg:mt-0">
            {chartData.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                    aria-hidden
                  />
                  <Typography variant="small">{item.name}</Typography>
                </div>
                <Typography
                  variant="small"
                  className="font-semibold tabular-nums"
                >
                  {item.value}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
