"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { healthRecordsChartData } from "@/app/(dashboards)/patient/_lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

const total = healthRecordsChartData.reduce((sum, item) => sum + item.value, 0)

export default function HealthRecordsChart() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Medical Vault Overview</CardTitle>
        <Typography variant="muted" className="text-sm">
          Distribution of your health records
        </Typography>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center lg:flex-row lg:items-center lg:gap-8">
          <div className="relative h-56 w-full max-w-xs shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[...healthRecordsChartData]}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {healthRecordsChartData.map((entry) => (
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
            {healthRecordsChartData.map((item) => (
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
