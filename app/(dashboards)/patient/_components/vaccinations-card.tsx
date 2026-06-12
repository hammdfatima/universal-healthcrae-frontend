"use client"

import { Syringe } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"

import {
  getVaccinationsFromStorage,
  initialVaccinations,
  type Vaccination,
} from "@/app/(dashboards)/patient/_lib/vaccinations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

export default function VaccinationsCard() {
  const [vaccinations, setVaccinations] =
    useState<Vaccination[]>(initialVaccinations)

  useEffect(() => {
    setVaccinations(getVaccinationsFromStorage())
  }, [])

  const recent = vaccinations.slice(0, 3)

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
      </CardContent>
    </Card>
  )
}
