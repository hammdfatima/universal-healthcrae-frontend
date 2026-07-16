"use client"

import { CreditCard } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  ADMIN_DASHBOARD_API,
  ADMIN_DASHBOARD_QUERY_KEYS,
  type AdminDashboardStatsResponse,
} from "@/lib/api/admin-dashboard"

function formatRevenue(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

function formatAxisRevenue(value: number) {
  if (value >= 1000) {
    const thousands = value / 1000
    return `$${thousands.toFixed(thousands >= 10 ? 0 : 1)}k`
  }

  return formatRevenue(value)
}

export default function PaymentsChart() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<AdminDashboardStatsResponse>({
      path: ADMIN_DASHBOARD_API.stats,
      queryKey: ADMIN_DASHBOARD_QUERY_KEYS.stats,
    })

  const chartData = data?.paymentsChart ?? []
  const hasRevenue = chartData.some((item) => item.revenue > 0)

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCard className="size-4" aria-hidden />
          </span>
          <div>
            <CardTitle>Payments Overview</CardTitle>
            <Typography variant="muted" className="text-sm">
              Monthly revenue across the year
            </Typography>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          asChild
        >
          <Link href={"/admin/payments" as Route}>View all</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Loader label="Loading payments chart..." className="py-16" />
        ) : isError ? (
          <ErrorCard
            error={error}
            onRetry={() => refetch()}
            isLoading={isFetching}
          />
        ) : !hasRevenue ? (
          <EmptyCard
            icon={CreditCard}
            title="No payment data yet"
            description="Revenue from paid subscriptions will appear here once payments are recorded."
          />
        ) : (
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                barCategoryGap="28%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-border/60"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatAxisRevenue}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                  formatter={(value: number) => [
                    formatRevenue(value),
                    "Revenue",
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(158 100% 33%)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
