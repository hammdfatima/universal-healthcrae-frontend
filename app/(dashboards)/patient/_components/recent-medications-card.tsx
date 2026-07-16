"use client"

import { Activity } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import {
  formatMedicationEndDate,
  isMedicationActive,
} from "@/app/(dashboards)/patient/_lib/medications"
import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  MEDICATIONS_API,
  MEDICATIONS_QUERY_KEYS,
  type MedicationsListResponse,
} from "@/lib/api/medications"

export default function RecentMedicationsCard() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<MedicationsListResponse>({
      path: MEDICATIONS_API.list,
      queryKey: MEDICATIONS_QUERY_KEYS.list,
    })

  const activeMedications = (data?.medications ?? [])
    .filter((medication) => isMedicationActive(medication.endDate))
    .slice(0, 5)

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Activity className="size-4" aria-hidden />
          </span>
          <CardTitle>Active Medications</CardTitle>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          asChild
        >
          <Link href={healthRecordHref("medications")}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-2 sm:px-6">
        {isLoading ? (
          <Loader label="Loading medications..." className="py-8" />
        ) : isError ? (
          <ErrorCard
            error={error}
            onRetry={() => refetch()}
            isLoading={isFetching}
          />
        ) : activeMedications.length === 0 ? (
          <EmptyCard
            icon={Activity}
            title="No active medications"
            description="Add your current prescriptions to keep track of what you are taking."
            action={
              <Button type="button" variant="outline" size="sm" asChild>
                <Link href={"/patient/medications/new" as Route}>
                  Add medication
                </Link>
              </Button>
            }
            className="border-none shadow-none"
          />
        ) : (
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[140px]">Medicine Name</TableHead>
                  <TableHead className="min-w-[130px]">Condition</TableHead>
                  <TableHead className="min-w-[160px]">Prescribed By</TableHead>
                  <TableHead className="min-w-[90px]">Dosage</TableHead>
                  <TableHead className="min-w-[110px]">Start Date</TableHead>
                  <TableHead className="min-w-[110px]">End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeMedications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell>
                      <Typography variant="small" className="font-medium">
                        {med.medicineName}
                      </Typography>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {med.condition}
                    </TableCell>
                    <TableCell>{med.prescribedBy}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {med.dosage}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {med.startDate}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {formatMedicationEndDate(med.endDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
