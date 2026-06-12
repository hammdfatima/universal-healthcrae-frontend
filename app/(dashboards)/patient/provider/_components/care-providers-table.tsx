"use client"

import { Eye, Plus, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  type CareProvider,
  formatOptionalEmail,
  getCareProvidersFromStorage,
  initialCareProviders,
  saveCareProvidersToStorage,
  truncateClinicDetails,
} from "@/app/(dashboards)/patient/_lib/providers"
import CareProviderDetailsDialog from "@/app/(dashboards)/patient/provider/_components/care-provider-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function CareProvidersTable() {
  const router = useRouter()
  const [providers, setProviders] =
    useState<CareProvider[]>(initialCareProviders)
  const [selectedProvider, setSelectedProvider] = useState<CareProvider | null>(
    null
  )
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    setProviders(getCareProvidersFromStorage())
  }, [])

  function updateProviders(next: CareProvider[]) {
    setProviders(next)
    saveCareProvidersToStorage(next)
  }

  function openDetails(provider: CareProvider) {
    setSelectedProvider(provider)
    setDetailsOpen(true)
  }

  function handleDelete(provider: CareProvider) {
    updateProviders(providers.filter((item) => item.id !== provider.id))
    setSelectedProvider(null)
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
      />
    </>
  )
}
