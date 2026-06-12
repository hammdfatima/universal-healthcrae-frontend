"use client"

import { UserRound } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"

import {
  type CareProvider,
  getCareProvidersFromStorage,
  getProviderInitials,
  getProviderSubtitle,
  initialCareProviders,
} from "@/app/(dashboards)/patient/_lib/providers"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

export default function CareTeamCard() {
  const [providers, setProviders] =
    useState<CareProvider[]>(initialCareProviders)

  useEffect(() => {
    setProviders(getCareProvidersFromStorage())
  }, [])

  const preview = providers.slice(0, 3)

  return (
    <Card className="border-border/60 shadow-sm">
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
      <CardContent className="space-y-3">
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
      </CardContent>
    </Card>
  )
}
