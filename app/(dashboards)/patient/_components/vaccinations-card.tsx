"use client"

import { Syringe } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"

import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  VACCINATIONS_API,
  VACCINATIONS_QUERY_KEYS,
  type VaccinationsListResponse,
} from "@/lib/api/vaccinations"

export default function VaccinationsCard() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<VaccinationsListResponse>({
      path: VACCINATIONS_API.list,
      queryKey: VACCINATIONS_QUERY_KEYS.list,
    })

  const recent = (data?.vaccinations ?? []).slice(0, 3)

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
            <Syringe className="size-4" aria-hidden />
          </span>
          <CardTitle>Recent Immunizations</CardTitle>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          asChild
        >
          <Link href={"/patient/vaccinations" as Route}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader label="Loading vaccinations..." className="py-8" />
        ) : isError ? (
          <ErrorCard
            error={error}
            onRetry={() => refetch()}
            isLoading={isFetching}
          />
        ) : recent.length === 0 ? (
          <EmptyCard
            icon={Syringe}
            title="No vaccinations recorded"
            description="Keep your immunization history up to date for travel and care visits."
            action={
              <Button type="button" variant="outline" size="sm" asChild>
                <Link href={"/patient/vaccinations/new" as Route}>
                  Add vaccination
                </Link>
              </Button>
            }
            className="border-none shadow-none"
          />
        ) : (
          <ul className="space-y-4">
            {recent.map((vax, index) => (
              <li key={vax.id} className="relative flex gap-4">
                {index < recent.length - 1 ? (
                  <span
                    className="absolute top-8 left-[11px] h-[calc(100%-4px)] w-px bg-border"
                    aria-hidden
                  />
                ) : null}
                <span className="relative z-10 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-secondary bg-card">
                  <span className="size-2 rounded-full bg-secondary" />
                </span>
                <div className="min-w-0 flex-1 pb-1">
                  <Typography variant="small" className="font-semibold">
                    {vax.vaccineName}
                  </Typography>
                  <Typography variant="muted" className="mt-0.5 text-sm">
                    {vax.date} · {vax.time}
                  </Typography>
                  <Typography variant="muted" className="mt-1 text-xs">
                    {vax.administeredBy}
                  </Typography>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
