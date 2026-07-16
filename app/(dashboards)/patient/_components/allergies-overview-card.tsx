"use client"

import { AlertTriangle } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"

import {
  formatSymptomsList,
  getNatureBadgeOutlineClass,
} from "@/app/(dashboards)/patient/_lib/allergies"
import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  ALLERGIES_API,
  ALLERGIES_QUERY_KEYS,
  type AllergiesListResponse,
} from "@/lib/api/allergies"
import { cn } from "@/lib/utils"

export default function AllergiesOverviewCard() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<AllergiesListResponse>({
      path: ALLERGIES_API.list,
      queryKey: ALLERGIES_QUERY_KEYS.list,
    })

  const allergies = (data?.allergies ?? []).slice(0, 2)

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-4" aria-hidden />
          </span>
          <CardTitle>Known Allergies</CardTitle>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          asChild
        >
          <Link href={healthRecordHref("allergies")}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Loader label="Loading allergies..." className="py-8" />
        ) : isError ? (
          <ErrorCard
            error={error}
            onRetry={() => refetch()}
            isLoading={isFetching}
          />
        ) : allergies.length === 0 ? (
          <EmptyCard
            icon={AlertTriangle}
            title="No allergies recorded"
            description="Document known allergies so your care team can treat you safely."
            action={
              <Button type="button" variant="outline" size="sm" asChild>
                <Link href={"/patient/allergies/new" as Route}>
                  Add allergy
                </Link>
              </Button>
            }
            className="border-none shadow-none"
          />
        ) : (
          allergies.map((allergy) => (
            <div
              key={allergy.id}
              className="rounded-2xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Typography variant="small" className="font-semibold">
                    {allergy.allergyType}
                  </Typography>
                  <Typography variant="muted" className="mt-1 text-sm">
                    {formatSymptomsList(allergy.symptoms, 1)}
                  </Typography>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 rounded-full",
                    getNatureBadgeOutlineClass(allergy.nature)
                  )}
                >
                  {allergy.nature}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
