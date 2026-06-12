"use client"

import { Eye, FlaskConical, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import {
  getLabResultsFromStorage,
  getTestTypeFilterOptions,
  initialLabResults,
  type LabResult,
  saveLabResultsToStorage,
} from "@/app/(dashboards)/patient/_lib/lab"
import LabResultDetailsDialog from "@/app/(dashboards)/patient/lab/_components/lab-result-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function LabResultsTable() {
  const router = useRouter()
  const [results, setResults] = useState<LabResult[]>(initialLabResults)
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    setResults(getLabResultsFromStorage())
  }, [])

  const testTypeOptions = useMemo(
    () => getTestTypeFilterOptions(results),
    [results]
  )

  function updateResults(next: LabResult[]) {
    setResults(next)
    saveLabResultsToStorage(next)
  }

  function openDetails(result: LabResult) {
    setSelectedResult(result)
    setDetailsOpen(true)
  }

  function handleDelete(result: LabResult) {
    updateResults(results.filter((item) => item.id !== result.id))
    setSelectedResult(null)
  }

  const columns: DataTableColumn<LabResult>[] = [
    {
      id: "fileName",
      header: "File Name",
      accessorKey: "fileName",
      cell: (row) => (
        <Typography variant="small" className="font-medium break-all">
          {row.fileName}
        </Typography>
      ),
    },
    {
      id: "testType",
      header: "Test Type",
      accessorKey: "testType",
      className: "hidden sm:table-cell",
      headerClassName: "hidden sm:table-cell",
    },
    {
      id: "testDate",
      header: "Test Date",
      accessorKey: "testDate",
      className: "hidden md:table-cell tabular-nums",
      headerClassName: "hidden md:table-cell",
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
          aria-label={`View ${row.fileName}`}
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
        title="Laboratory"
        description="View and manage your lab reports and test results."
        icon={<FlaskConical className="size-5" />}
        columns={columns}
        data={results}
        getRowId={(row) => row.id}
        searchPlaceholder="Search lab results..."
        filters={
          testTypeOptions.length > 0
            ? [
                {
                  id: "testType",
                  label: "Test Type",
                  accessorKey: "testType",
                  options: testTypeOptions,
                },
              ]
            : []
        }
        actions={
          <Button onClick={() => router.push("/patient/lab/new")}>
            <Plus className="size-4" aria-hidden />
            Add Lab Result
          </Button>
        }
        emptyMessage="No lab results found. Upload your first lab report to get started."
      />

      <LabResultDetailsDialog
        result={selectedResult}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDelete={handleDelete}
      />
    </>
  )
}
