"use client"

import { Eye, Users } from "lucide-react"
import { useState } from "react"

import SharedMedicalRecordsDialog from "@/app/(dashboards)/patient/_components/shared-medical-records-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  MEDICAL_RECORD_SHARES_API,
  MEDICAL_RECORD_SHARES_QUERY_KEYS,
  type SidebarFamilyMember,
  type SidebarFamilyResponse,
} from "@/lib/api/medical-record-shares"

export default function HouseholdFamilyTable() {
  const [selectedMember, setSelectedMember] =
    useState<SidebarFamilyMember | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useFetch<SidebarFamilyResponse>({
      path: MEDICAL_RECORD_SHARES_API.sidebarFamily,
      queryKey: MEDICAL_RECORD_SHARES_QUERY_KEYS.sidebarFamily,
    })

  const members = data?.members ?? []

  const columns: DataTableColumn<SidebarFamilyMember>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <Typography variant="small" className="font-medium">
          {`${row.firstName} ${row.lastName}`.trim() || row.email}
        </Typography>
      ),
    },
    {
      id: "relationship",
      header: "Relationship",
      accessorKey: "relationship",
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      className: "hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "shared",
      header: "Shared with you",
      cell: (row) =>
        row.hasSharedRecordsWithMe ? (
          <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
            Yes
          </Badge>
        ) : (
          <Typography variant="muted" className="text-sm">
            No
          </Typography>
        ),
      searchable: false,
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
          aria-label={`View ${row.firstName} ${row.lastName}`}
          onClick={() => {
            setSelectedMember(row)
            setDetailsOpen(true)
          }}
        >
          <Eye className="size-4" aria-hidden />
        </Button>
      ),
    },
  ]

  return (
    <>
      <DataTable
        title="My Family"
        description="View the family account holder who added you. Use the eye icon to open their details and shared medical records."
        icon={<Users className="size-5" />}
        columns={columns}
        data={members}
        getRowId={(row) => row.userId}
        searchPlaceholder="Search family..."
        isLoading={isLoading}
        loadingLabel="Loading family..."
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching && !isLoading}
        emptyMessage="No family account linked yet."
        emptyDescription="When you are added to a family account, they will appear here."
      />

      <SharedMedicalRecordsDialog
        member={selectedMember}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  )
}
