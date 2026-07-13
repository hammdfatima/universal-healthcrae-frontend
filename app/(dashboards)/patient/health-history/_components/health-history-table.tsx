"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Eye, History, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import {
  getPrescribedByFilterOptions,
  truncateDetails,
} from "@/app/(dashboards)/patient/_lib/health-history"
import HealthHistoryDetailsDialog from "@/app/(dashboards)/patient/health-history/_components/health-history-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import type { HealthHistoryEntry } from "@/lib/api/health-history"
import {
  HEALTH_HISTORY_API,
  HEALTH_HISTORY_QUERY_KEYS,
  type HealthHistoryListResponse,
} from "@/lib/api/health-history"
import { useVaultPatient } from "@/provider/vault-patient-provider"

export default function HealthHistoryTable() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { withPatientQuery, vaultQueryKey, isViewingOwnVault, activePatient } =
    useVaultPatient()
  const [selectedEntry, setSelectedEntry] = useState<HealthHistoryEntry | null>(
    null
  )
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useFetch<HealthHistoryListResponse>({
      path: withPatientQuery(HEALTH_HISTORY_API.list),
      queryKey: vaultQueryKey(HEALTH_HISTORY_QUERY_KEYS.list),
    })

  const entries = data?.entries ?? []

  const prescribedByOptions = useMemo(
    () => getPrescribedByFilterOptions(entries),
    [entries]
  )

  const { onRequest: deleteHealthHistoryEntry, isPending: isDeleting } = useApi<
    Record<string, never>
  >({
    key: "delete-health-history-entry",
    method: "delete",
  })

  function openDetails(entry: HealthHistoryEntry) {
    setSelectedEntry(entry)
    setDetailsOpen(true)
  }

  function handleDelete(entry: HealthHistoryEntry) {
    deleteHealthHistoryEntry({
      path: HEALTH_HISTORY_API.delete(entry.id),
      data: {},
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: HEALTH_HISTORY_QUERY_KEYS.list,
        })
        refetch()
        setSelectedEntry(null)
      },
    })
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
        description={
          isViewingOwnVault
            ? "Record past illnesses, diagnoses, and treatments."
            : `Viewing health history for ${activePatient?.firstName ?? "family member"} ${activePatient?.lastName ?? ""}`.trim()
        }
        icon={<History className="size-5" />}
        columns={columns}
        data={entries}
        getRowId={(row) => row.id}
        searchPlaceholder="Search health history..."
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching && !isLoading}
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
          isViewingOwnVault ? (
            <Button onClick={() => router.push("/patient/health-history/new")}>
              <Plus className="size-4" aria-hidden />
              Add Diagnosis
            </Button>
          ) : undefined
        }
        emptyMessage={
          isViewingOwnVault
            ? "No diagnoses found. Add your first health history entry to get started."
            : "No health history shared for this family member."
        }
      />

      <HealthHistoryDetailsDialog
        entry={selectedEntry}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDelete={isViewingOwnVault ? handleDelete : undefined}
        isDeleting={isDeleting}
        readOnly={!isViewingOwnVault}
      />
    </>
  )
}
