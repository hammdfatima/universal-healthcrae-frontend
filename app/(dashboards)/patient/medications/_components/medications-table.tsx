"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Activity, Eye, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import {
  formatMedicationEndDate,
  formatMedicationSchedule,
  getConditionFilterOptions,
  getDueMedicationDoses,
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
import { useVaultPatient } from "@/provider/vault-patient-provider"

export default function MedicationsTable() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { withPatientQuery, vaultQueryKey, isViewingOwnVault, activePatient } =
    useVaultPatient()
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useFetch<MedicationsListResponse>({
      path: withPatientQuery(MEDICATIONS_API.list),
      queryKey: vaultQueryKey(MEDICATIONS_QUERY_KEYS.list),
    })

  const medications = data?.medications ?? []
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(intervalId)
  }, [])

  const dueDoses = useMemo(
    () => getDueMedicationDoses(medications, now),
    [medications, now]
  )

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
      id: "schedule",
      header: "Schedule",
      cell: (row) => (
        <Typography variant="muted" className="text-sm">
          {formatMedicationSchedule(row)}
        </Typography>
      ),
      searchable: false,
      className: "hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
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
      {dueDoses.length > 0 ? (
        <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
          <Typography variant="small" className="font-medium text-primary">
            Medication reminder
          </Typography>
          <Typography variant="muted" className="mt-1 text-sm">
            {dueDoses
              .map(
                (dose) =>
                  `${dose.medication.medicineName} (${dose.medication.dosage}) at ${dose.label}`
              )
              .join(" · ")}
          </Typography>
        </div>
      ) : null}

      <DataTable
        title="Medications"
        description={
          isViewingOwnVault
            ? "Manage your current and past prescriptions."
            : `Viewing medications for ${activePatient?.firstName ?? "family member"} ${activePatient?.lastName ?? ""}`.trim()
        }
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
          isViewingOwnVault ? (
            <Button onClick={() => router.push("/patient/medications/new")}>
              <Plus className="size-4" aria-hidden />
              Add Medication
            </Button>
          ) : undefined
        }
        emptyMessage={
          isViewingOwnVault
            ? "No medications found. Add your first medication to get started."
            : "No medications shared for this family member."
        }
      />

      <MedicationDetailsDialog
        medication={selectedMedication}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDelete={isViewingOwnVault ? handleDelete : undefined}
        isDeleting={isDeleting}
        readOnly={!isViewingOwnVault}
      />
    </>
  )
}
