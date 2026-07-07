"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Eye, Plus, ScanLine } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import {
  getImagingScanTypeFilterOptions,
  getImagingTestTypeFilterOptions,
} from "@/app/(dashboards)/patient/_lib/imaging"
import ImagingResultDetailsDialog from "@/app/(dashboards)/patient/imaging/_components/imaging-result-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import type { ImagingResult } from "@/lib/api/imaging-results"
import {
  IMAGING_RESULTS_API,
  IMAGING_RESULTS_QUERY_KEYS,
  type ImagingResultsListResponse,
} from "@/lib/api/imaging-results"

export default function ImagingResultsTable() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedResult, setSelectedResult] = useState<ImagingResult | null>(
    null
  )
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useFetch<ImagingResultsListResponse>({
      path: IMAGING_RESULTS_API.list,
      queryKey: IMAGING_RESULTS_QUERY_KEYS.list,
    })

  const results = data?.imagingResults ?? []

  const testTypeOptions = useMemo(
    () => getImagingTestTypeFilterOptions(results),
    [results]
  )

  const scanTypeOptions = useMemo(
    () => getImagingScanTypeFilterOptions(results),
    [results]
  )

  const { onRequest: deleteImagingResult, isPending: isDeleting } = useApi<
    Record<string, never>
  >({
    key: "delete-imaging-result",
    method: "delete",
  })

  function openDetails(result: ImagingResult) {
    setSelectedResult(result)
    setDetailsOpen(true)
  }

  function handleDelete(result: ImagingResult) {
    deleteImagingResult({
      path: IMAGING_RESULTS_API.delete(result.id),
      data: {},
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: IMAGING_RESULTS_QUERY_KEYS.list,
        })
        refetch()
        setSelectedResult(null)
      },
    })
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
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching && !isLoading}
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
        isDeleting={isDeleting}
      />
    </>
  )
}
