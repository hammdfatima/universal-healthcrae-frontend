"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Eye, FlaskConical, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { getTestTypeFilterOptions } from "@/app/(dashboards)/patient/_lib/lab"
import LabResultDetailsDialog from "@/app/(dashboards)/patient/lab/_components/lab-result-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import type { LabResult } from "@/lib/api/lab-results"
import {
  LAB_RESULTS_API,
  LAB_RESULTS_QUERY_KEYS,
  type LabResultsListResponse,
} from "@/lib/api/lab-results"

export default function LabResultsTable() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useFetch<LabResultsListResponse>({
      path: LAB_RESULTS_API.list,
      queryKey: LAB_RESULTS_QUERY_KEYS.list,
    })

  const results = data?.labResults ?? []

  const testTypeOptions = useMemo(
    () => getTestTypeFilterOptions(results),
    [results]
  )

  const { onRequest: deleteLabResult, isPending: isDeleting } = useApi<
    Record<string, never>
  >({
    key: "delete-lab-result",
    method: "delete",
  })

  function openDetails(result: LabResult) {
    setSelectedResult(result)
    setDetailsOpen(true)
  }

  function handleDelete(result: LabResult) {
    deleteLabResult({
      path: LAB_RESULTS_API.delete(result.id),
      data: {},
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: LAB_RESULTS_QUERY_KEYS.list,
        })
        refetch()
        setSelectedResult(null)
      },
    })
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
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching && !isLoading}
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
        isDeleting={isDeleting}
      />
    </>
  )
}
