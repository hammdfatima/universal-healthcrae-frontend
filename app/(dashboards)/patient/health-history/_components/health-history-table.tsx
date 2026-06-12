"use client"

import { Eye, History, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import {
  getHealthHistoryFromStorage,
  getPrescribedByFilterOptions,
  type HealthHistoryEntry,
  initialHealthHistory,
  saveHealthHistoryToStorage,
  truncateDetails,
} from "@/app/(dashboards)/patient/_lib/health-history"
import HealthHistoryDetailsDialog from "@/app/(dashboards)/patient/health-history/_components/health-history-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function HealthHistoryTable() {
  const router = useRouter()
  const [entries, setEntries] =
    useState<HealthHistoryEntry[]>(initialHealthHistory)
  const [selectedEntry, setSelectedEntry] = useState<HealthHistoryEntry | null>(
    null
  )
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    setEntries(getHealthHistoryFromStorage())
  }, [])

  const prescribedByOptions = useMemo(
    () => getPrescribedByFilterOptions(entries),
    [entries]
  )

  function updateEntries(next: HealthHistoryEntry[]) {
    setEntries(next)
    saveHealthHistoryToStorage(next)
  }

  function openDetails(entry: HealthHistoryEntry) {
    setSelectedEntry(entry)
    setDetailsOpen(true)
  }

  function handleDelete(entry: HealthHistoryEntry) {
    updateEntries(entries.filter((item) => item.id !== entry.id))
    setSelectedEntry(null)
  }

  const columns: DataTableColumn<HealthHistoryEntry>[] = [
    {
      id: "illnessName",
      header: "Illness / Condition",
      accessorKey: "illnessName",
      cell: (row) => (
        <Typography variant="small" className="font-medium">
          {row.illnessName}
        </Typography>
      ),
    },
    {
      id: "diagnosisDate",
      header: "Date of Diagnosis",
      accessorKey: "diagnosisDate",
      className: "hidden sm:table-cell tabular-nums",
      headerClassName: "hidden sm:table-cell",
    },
    {
      id: "prescribedBy",
      header: "GP / Consultant",
      accessorKey: "prescribedBy",
      className: "hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "details",
      header: "Details",
      cell: (row) => (
        <Typography variant="muted" className="text-sm">
          {truncateDetails(row.details)}
        </Typography>
      ),
      className: "hidden lg:table-cell max-w-xs",
      headerClassName: "hidden lg:table-cell",
    },
    {
      id: "actions",
      header: "",
      className: "w-12 text-right",
      headerClassName: "w-12 text-right",
      searchable: false,
      cell: (row) => (
        <Button
          type="button"
          variant="ghost"
          className="size-8 rounded-full"
          aria-label={`View ${row.illnessName}`}
          onClick={() => openDetails(row)}
        >
          <Eye className="size-4" aria-hidden />
        </Button>
      ),
    },
  ]

  return (
    <>
      <DataTable
        title="Health History"
        description="Record past illnesses, diagnoses, and treatments."
        icon={<History className="size-5" />}
        columns={columns}
        data={entries}
        getRowId={(row) => row.id}
        searchPlaceholder="Search health history..."
        filters={
          prescribedByOptions.length > 0
            ? [
                {
                  id: "prescribedBy",
                  label: "GP / Consultant",
                  accessorKey: "prescribedBy",
                  options: prescribedByOptions,
                },
              ]
            : []
        }
        actions={
          <Button onClick={() => router.push("/patient/health-history/new")}>
            <Plus className="size-4" aria-hidden />
            Add Diagnosis
          </Button>
        }
        emptyMessage="No diagnoses found. Add your first health history entry to get started."
      />

      <HealthHistoryDetailsDialog
        entry={selectedEntry}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDelete={handleDelete}
      />
    </>
  )
}
