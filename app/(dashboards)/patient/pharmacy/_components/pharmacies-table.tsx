"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Eye, Pill, Plus } from "lucide-react"
import type { Route } from "next"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { truncateAddress } from "@/app/(dashboards)/patient/_lib/pharmacies"
import PharmacyDetailsDialog from "@/app/(dashboards)/patient/pharmacy/_components/pharmacy-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import type { Pharmacy } from "@/lib/api/pharmacies"
import {
  PHARMACIES_API,
  PHARMACIES_QUERY_KEYS,
  type PharmaciesListResponse,
} from "@/lib/api/pharmacies"
import { useVaultPatient } from "@/provider/vault-patient-provider"

export default function PharmaciesTable() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { withPatientQuery, vaultQueryKey, isViewingOwnVault, activePatient } =
    useVaultPatient()
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null
  )
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useFetch<PharmaciesListResponse>({
      path: withPatientQuery(PHARMACIES_API.list),
      queryKey: vaultQueryKey(PHARMACIES_QUERY_KEYS.list),
    })

  const pharmacies = data?.pharmacies ?? []

  const { onRequest: deletePharmacy, isPending: isDeleting } = useApi<
    Record<string, never>
  >({
    key: "delete-pharmacy",
    method: "delete",
  })

  function openDetails(pharmacy: Pharmacy) {
    setSelectedPharmacy(pharmacy)
    setDetailsOpen(true)
  }

  function handleDelete(pharmacy: Pharmacy) {
    deletePharmacy({
      path: PHARMACIES_API.delete(pharmacy.id),
      data: {},
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: PHARMACIES_QUERY_KEYS.list,
        })
        refetch()
        setSelectedPharmacy(null)
      },
    })
  }

  const columns: DataTableColumn<Pharmacy>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      cell: (row) => (
        <Typography variant="small" className="font-medium">
          {row.name}
        </Typography>
      ),
    },
    {
      id: "phone",
      header: "Phone",
      accessorKey: "phone",
      className: "hidden sm:table-cell tabular-nums",
      headerClassName: "hidden sm:table-cell",
    },
    {
      id: "address",
      header: "Address",
      cell: (row) => (
        <Typography variant="muted" className="text-sm">
          {truncateAddress(row.address)}
        </Typography>
      ),
      className: "hidden md:table-cell max-w-xs",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "notes",
      header: "Notes",
      cell: (row) => (
        <Typography variant="muted" className="text-sm">
          {truncateAddress(row.notes)}
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
          aria-label={`View ${row.name}`}
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
        title="Pharmacy"
        description={
          isViewingOwnVault
            ? "Save preferred pharmacies for prescriptions and refills."
            : `Viewing pharmacies for ${activePatient?.firstName ?? "family member"} ${activePatient?.lastName ?? ""}`.trim()
        }
        icon={<Pill className="size-5" />}
        columns={columns}
        data={pharmacies}
        getRowId={(row) => row.id}
        searchPlaceholder="Search pharmacies..."
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching && !isLoading}
        actions={
          isViewingOwnVault ? (
            <Button
              onClick={() => router.push("/patient/pharmacy/new" as Route)}
            >
              <Plus className="size-4" aria-hidden />
              Add Pharmacy
            </Button>
          ) : undefined
        }
        emptyMessage={
          isViewingOwnVault
            ? "No preferred pharmacies yet. Add one to get started."
            : "No preferred pharmacies shared for this family member."
        }
      />

      <PharmacyDetailsDialog
        pharmacy={selectedPharmacy}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDelete={isViewingOwnVault ? handleDelete : undefined}
        isDeleting={isDeleting}
        canManage={isViewingOwnVault}
      />
    </>
  )
}
