"use client"

import { Eye, Plus, ScanLine } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import {
  getImagingResultsFromStorage,
  getImagingScanTypeFilterOptions,
  getImagingTestTypeFilterOptions,
  type ImagingResult,
  initialImagingResults,
  saveImagingResultsToStorage,
} from "@/app/(dashboards)/patient/_lib/imaging"
import ImagingResultDetailsDialog from "@/app/(dashboards)/patient/imaging/_components/imaging-result-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function ImagingResultsTable() {
  const router = useRouter()
  const [results, setResults] = useState<ImagingResult[]>(initialImagingResults)
  const [selectedResult, setSelectedResult] = useState<ImagingResult | null>(
    null
  )
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    setResults(getImagingResultsFromStorage())
  }, [])

  const testTypeOptions = useMemo(
    () => getImagingTestTypeFilterOptions(results),
    [results]
  )

  const scanTypeOptions = useMemo(
    () => getImagingScanTypeFilterOptions(results),
    [results]
  )

  function updateResults(next: ImagingResult[]) {
    setResults(next)
    saveImagingResultsToStorage(next)
  }

  function openDetails(result: ImagingResult) {
    setSelectedResult(result)
    setDetailsOpen(true)
  }

  function handleDelete(result: ImagingResult) {
    updateResults(results.filter((item) => item.id !== result.id))
    setSelectedResult(null)
  }

  const columns: DataTableColumn<ImagingResult>[] = [
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
      id: "scanType",
      header: "Scan Type",
      accessorKey: "scanType",
      className: "hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "scanDate",
      header: "Scan Date",
      accessorKey: "scanDate",
      className: "hidden lg:table-cell tabular-nums",
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
          aria-label={`View ${row.fileName}`}
          onClick={() => openDetails(row)}
        >
          <Eye className="size-4" aria-hidden />
        </Button>
      ),
    },
  ]

  const filters = [
    ...(testTypeOptions.length > 0
      ? [
          {
            id: "testType",
            label: "Test Type",
            accessorKey: "testType" as const,
            options: testTypeOptions,
          },
        ]
      : []),
    ...(scanTypeOptions.length > 0
      ? [
          {
            id: "scanType",
            label: "Scan Type",
            accessorKey: "scanType" as const,
            options: scanTypeOptions,
          },
        ]
      : []),
  ]

  return (
    <>
      <DataTable
        title="Imaging"
        description="View and manage your radiology scans and imaging reports."
        icon={<ScanLine className="size-5" />}
        columns={columns}
        data={results}
        getRowId={(row) => row.id}
        searchPlaceholder="Search imaging records..."
        filters={filters}
        actions={
          <Button onClick={() => router.push("/patient/imaging/new")}>
            <Plus className="size-4" aria-hidden />
            Add Imaging
          </Button>
        }
        emptyMessage="No imaging records found. Upload your first scan to get started."
      />

      <ImagingResultDetailsDialog
        result={selectedResult}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDelete={handleDelete}
      />
    </>
  )
}
