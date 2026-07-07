"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Activity, Eye, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import {
  formatMedicationEndDate,
  getConditionFilterOptions,
  isMedicationActive,
  isMedicationEnded,
} from "@/app/(dashboards)/patient/_lib/medications"
import MedicationDetailsDialog from "@/app/(dashboards)/patient/medications/_components/medication-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import type { Medication } from "@/lib/api/medications"
import {
  MEDICATIONS_API,
  MEDICATIONS_QUERY_KEYS,
  type MedicationsListResponse,
} from "@/lib/api/medications"

export default function MedicationsTable() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useFetch<MedicationsListResponse>({
      path: MEDICATIONS_API.list,
      queryKey: MEDICATIONS_QUERY_KEYS.list,
    })

  const medications = data?.medications ?? []

  const conditionOptions = useMemo(
    () => getConditionFilterOptions(medications),
    [medications]
  )

  const { onRequest: deleteMedication, isPending: isDeleting } = useApi<
    Record<string, never>
  >({
    key: "delete-medication",
    method: "delete",
  })

  function openDetails(medication: Medication) {
    setSelectedMedication(medication)
    setDetailsOpen(true)
  }

  function handleDelete(medication: Medication) {
    deleteMedication({
      path: MEDICATIONS_API.delete(medication.id),
      data: {},
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: MEDICATIONS_QUERY_KEYS.list,
        })
        refetch()
        setSelectedMedication(null)
      },
    })
  }

  const columns: DataTableColumn<Medication>[] = [
    {
      id: "medicineName",
      header: "Medicine Name",
      accessorKey: "medicineName",
      cell: (row) => (
        <Typography variant="small" className="font-medium">
          {row.medicineName}
        </Typography>
      ),
    },
    {
      id: "condition",
      header: "Condition",
      accessorKey: "condition",
    },
    {
      id: "prescribedBy",
      header: "Prescribed By",
      accessorKey: "prescribedBy",
      className: "hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
    },
    {
      id: "dosage",
      header: "Dosage",
      accessorKey: "dosage",
      className: "hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "startDate",
      header: "Start Date",
      accessorKey: "startDate",
      className: "hidden sm:table-cell tabular-nums",
      headerClassName: "hidden sm:table-cell",
    },
    {
      id: "endDate",
      header: "End Date",
      cell: (row) => (
        <Typography variant="muted" className="text-sm tabular-nums">
          {formatMedicationEndDate(row.endDate)}
        </Typography>
      ),
      searchable: false,
      className: "hidden xl:table-cell",
      headerClassName: "hidden xl:table-cell",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) =>
        isMedicationActive(row.endDate) ? (
          <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
            Active
          </Badge>
        ) : (
          <Badge
            variant="destructive"
            className="rounded-full hover:bg-destructive"
          >
            Ended
          </Badge>
        ),
      searchable: false,
      className: "hidden md:table-cell",
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
          aria-label={`View ${row.medicineName}`}
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
        title="Medications"
        description="Manage your current and past prescriptions."
        icon={<Activity className="size-5" />}
        columns={columns}
        data={medications}
        getRowId={(row) => row.id}
        searchPlaceholder="Search medications..."
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching && !isLoading}
        filters={
          conditionOptions.length > 0
            ? [
                {
                  id: "condition",
                  label: "Condition",
                  accessorKey: "condition",
                  options: conditionOptions,
                },
                {
                  id: "status",
                  label: "Status",
                  filterFn: (row, value) => {
                    if (value === "active")
                      return isMedicationActive(row.endDate)
                    if (value === "ended") return isMedicationEnded(row.endDate)
                    return true
                  },
                  options: [
                    { label: "Active", value: "active" },
                    { label: "Ended", value: "ended" },
                  ],
                },
              ]
            : []
        }
        actions={
          <Button onClick={() => router.push("/patient/medications/new")}>
            <Plus className="size-4" aria-hidden />
            Add Medication
          </Button>
        }
        emptyMessage="No medications found. Add your first medication to get started."
      />

      <MedicationDetailsDialog
        medication={selectedMedication}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}
