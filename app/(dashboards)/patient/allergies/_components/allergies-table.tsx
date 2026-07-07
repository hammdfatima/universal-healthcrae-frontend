"use client"

import { useQueryClient } from "@tanstack/react-query"
import { AlertTriangle, Eye, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import {
  ALLERGY_TYPE_FOOD,
  formatSymptomsList,
  formatTriggersList,
  getAllergyTypeFilterOptions,
  getNatureBadgeClass,
  natureOptions,
} from "@/app/(dashboards)/patient/_lib/allergies"
import AllergyDetailsDialog from "@/app/(dashboards)/patient/allergies/_components/allergy-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import type { Allergy } from "@/lib/api/allergies"
import {
  ALLERGIES_API,
  ALLERGIES_QUERY_KEYS,
  type AllergiesListResponse,
} from "@/lib/api/allergies"
import { cn } from "@/lib/utils"

export default function AllergiesTable() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useFetch<AllergiesListResponse>({
      path: ALLERGIES_API.list,
      queryKey: ALLERGIES_QUERY_KEYS.list,
    })

  const allergies = data?.allergies ?? []

  const typeOptions = useMemo(
    () => getAllergyTypeFilterOptions(allergies),
    [allergies]
  )

  const { onRequest: deleteAllergy, isPending: isDeleting } = useApi<
    Record<string, never>
  >({
    key: "delete-allergy",
    method: "delete",
  })

  function openDetails(allergy: Allergy) {
    setSelectedAllergy(allergy)
    setDetailsOpen(true)
  }

  function handleDelete(allergy: Allergy) {
    deleteAllergy({
      path: ALLERGIES_API.delete(allergy.id),
      data: {},
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ALLERGIES_QUERY_KEYS.list,
        })
        refetch()
        setSelectedAllergy(null)
      },
    })
  }

  const columns: DataTableColumn<Allergy>[] = [
    {
      id: "allergyType",
      header: "Allergy Type",
      accessorKey: "allergyType",
      cell: (row) => (
        <Typography variant="small" className="font-medium">
          {row.allergyType}
        </Typography>
      ),
    },
    {
      id: "nature",
      header: "Nature",
      accessorKey: "nature",
      cell: (row) => (
        <Badge className={cn("rounded-full", getNatureBadgeClass(row.nature))}>
          {row.nature}
        </Badge>
      ),
    },
    {
      id: "symptoms",
      header: "Symptoms",
      cell: (row) => (
        <Typography variant="muted" className="text-sm">
          {formatSymptomsList(row.symptoms)}
        </Typography>
      ),
      searchable: false,
      className: "hidden md:table-cell max-w-xs",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "triggers",
      header: "Triggers",
      cell: (row) => (
        <Typography variant="muted" className="text-sm">
          {row.allergyType === ALLERGY_TYPE_FOOD
            ? formatTriggersList(row.triggers)
            : "—"}
        </Typography>
      ),
      searchable: false,
      className: "hidden lg:table-cell",
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
          aria-label={`View ${row.allergyType} allergy`}
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
        title="Known Allergies"
        description="Track allergy types, severity, symptoms, and food triggers."
        icon={<AlertTriangle className="size-5" />}
        columns={columns}
        data={allergies}
        getRowId={(row) => row.id}
        searchPlaceholder="Search allergies..."
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching && !isLoading}
        filters={[
          {
            id: "allergyType",
            label: "Allergy Type",
            accessorKey: "allergyType",
            options: typeOptions,
          },
          {
            id: "nature",
            label: "Nature",
            accessorKey: "nature",
            options: natureOptions.map((option) => ({
              label: option.label,
              value: option.value,
            })),
          },
        ]}
        actions={
          <Button onClick={() => router.push("/patient/allergies/new")}>
            <Plus className="size-4" aria-hidden />
            Add Allergy
          </Button>
        }
        emptyMessage="No allergies found. Add your first allergy record to get started."
      />

      <AllergyDetailsDialog
        allergy={selectedAllergy}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}
