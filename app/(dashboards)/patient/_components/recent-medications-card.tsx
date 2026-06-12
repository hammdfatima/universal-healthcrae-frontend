import { Activity } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"

import { recentMedications } from "@/app/(dashboards)/patient/_lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function RecentMedicationsCard() {
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
          <Link href={"/patient/medications" as Route}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-2 sm:px-6">
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
              {recentMedications.map((med) => (
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
                    {med.endDate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
