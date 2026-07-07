"use client"

import { UserRound } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"

import {
  getProviderInitials,
  getProviderSubtitle,
} from "@/app/(dashboards)/patient/_lib/providers"
import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  CARE_PROVIDERS_API,
  CARE_PROVIDERS_QUERY_KEYS,
  type CareProvidersListResponse,
} from "@/lib/api/care-providers"

export default function CareTeamCard() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<CareProvidersListResponse>({
      path: CARE_PROVIDERS_API.list,
      queryKey: CARE_PROVIDERS_QUERY_KEYS.list,
    })

  const preview = (data?.providers ?? []).slice(0, 3)

  return (
    <Card className="flex h-full w-full flex-col border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRound className="size-4" aria-hidden />
          </span>
          <CardTitle>Care Providers</CardTitle>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          asChild
        >
          <Link href={"/patient/provider" as Route}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-3">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-8">
            <Loader label="Loading care providers..." />
          </div>
        ) : isError ? (
          <div className="flex flex-1 flex-col">
            <ErrorCard
              error={error}
              onRetry={() => refetch()}
              isLoading={isFetching}
            />
          </div>
        ) : preview.length === 0 ? (
          <EmptyCard
            icon={UserRound}
            title="No care providers added"
            description="Add your doctors and specialists so they are easy to reach."
            action={
              <Button type="button" variant="outline" size="sm" asChild>
                <Link href={"/patient/provider/new" as Route}>
                  Add care provider
                </Link>
              </Button>
            }
            className="h-full flex-1 border-none shadow-none"
          />
        ) : (
          <>
            {preview.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 p-3"
              >
                <Avatar className="size-10 border border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {getProviderInitials(provider.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <Typography variant="small" className="font-semibold">
                    {provider.name}
                  </Typography>
                  <Typography variant="muted" className="text-sm">
                    {getProviderSubtitle(provider)}
                  </Typography>
                </div>
              </div>
            ))}
            <div className="flex-1" aria-hidden />
          </>
        )}
      </CardContent>
    </Card>
  )
}
