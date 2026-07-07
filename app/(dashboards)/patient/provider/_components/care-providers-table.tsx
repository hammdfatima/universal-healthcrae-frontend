"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Eye, Plus, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  formatOptionalEmail,
  truncateClinicDetails,
} from "@/app/(dashboards)/patient/_lib/providers"
import CareProviderDetailsDialog from "@/app/(dashboards)/patient/provider/_components/care-provider-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import type { CareProvider } from "@/lib/api/care-providers"
import {
  CARE_PROVIDERS_API,
  CARE_PROVIDERS_QUERY_KEYS,
  type CareProvidersListResponse,
} from "@/lib/api/care-providers"

export default function CareProvidersTable() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedProvider, setSelectedProvider] = useState<CareProvider | null>(
    null
  )
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useFetch<CareProvidersListResponse>({
      path: CARE_PROVIDERS_API.list,
      queryKey: CARE_PROVIDERS_QUERY_KEYS.list,
    })

  const providers = data?.providers ?? []

  const { onRequest: deleteCareProvider, isPending: isDeleting } = useApi<
    Record<string, never>
  >({
    key: "delete-care-provider",
    method: "delete",
  })

  function openDetails(provider: CareProvider) {
    setSelectedProvider(provider)
    setDetailsOpen(true)
  }

  function handleDelete(provider: CareProvider) {
    deleteCareProvider({
      path: CARE_PROVIDERS_API.delete(provider.id),
      data: {},
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: CARE_PROVIDERS_QUERY_KEYS.list,
        })
        refetch()
        setSelectedProvider(null)
      },
    })
  }

  const columns: DataTableColumn<CareProvider>[] = [
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
      id: "email",
      header: "Email",
      cell: (row) => (
        <Typography variant="muted" className="text-sm">
          {formatOptionalEmail(row.email)}
        </Typography>
      ),
      className: "hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "clinicDetails",
      header: "Clinic Details",
      cell: (row) => (
        <Typography variant="muted" className="text-sm">
          {truncateClinicDetails(row.clinicDetails)}
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
        title="Care Providers"
        description="Manage your doctors and healthcare providers."
        icon={<UserRound className="size-5" />}
        columns={columns}
        data={providers}
        getRowId={(row) => row.id}
        searchPlaceholder="Search care providers..."
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching && !isLoading}
        actions={
          <Button onClick={() => router.push("/patient/provider/new")}>
            <Plus className="size-4" aria-hidden />
            Add Provider
          </Button>
        }
        emptyMessage="No care providers found. Add your first provider to get started."
      />

      <CareProviderDetailsDialog
        provider={selectedProvider}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}
