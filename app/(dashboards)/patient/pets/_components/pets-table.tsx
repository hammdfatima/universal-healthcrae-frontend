"use client"

import { Eye, PawPrint, Plus, Share2 } from "lucide-react"
import type { Route } from "next"
import { useRouter } from "next/navigation"
import { useState } from "react"

import PetSharingDialog from "@/app/(dashboards)/patient/family-members/_components/pet-sharing-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import type { Pet } from "@/lib/api/pets"
import {
  PETS_API,
  PETS_QUERY_KEYS,
  type PetsListResponse,
} from "@/lib/api/pets"

export default function PetsTable() {
  const router = useRouter()
  const [sharingPet, setSharingPet] = useState<Pet | null>(null)
  const [sharingOpen, setSharingOpen] = useState(false)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useFetch<PetsListResponse>({
      path: PETS_API.list,
      queryKey: PETS_QUERY_KEYS.list,
    })

  const pets = data?.pets ?? []

  const columns: DataTableColumn<Pet>[] = [
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
      id: "species",
      header: "Species",
      accessorKey: "species",
    },
    {
      id: "breed",
      header: "Breed",
      accessorKey: "breed",
      cell: (row) => row.breed ?? "—",
    },
    {
      id: "actions",
      header: "",
      className: "w-24 text-right",
      headerClassName: "w-24 text-right",
      searchable: false,
      cell: (row) => (
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            className="size-8 rounded-full"
            aria-label={`Share ${row.name}`}
            onClick={() => {
              setSharingPet(row)
              setSharingOpen(true)
            }}
          >
            <Share2 className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="size-8 rounded-full"
            aria-label={`View ${row.name}`}
            onClick={() => router.push(`/patient/pets/${row.id}` as Route)}
          >
            <Eye className="size-4" aria-hidden />
          </Button>
        </div>
      ),
    },
  ]

  const addPetAction = (
    <Button onClick={() => router.push("/patient/pets/new" as Route)}>
      <Plus className="size-4" aria-hidden />
      Add Pet
    </Button>
  )

  return (
    <>
      <DataTable
        title="Pets"
        description="Manage your pet profiles and veterinary information."
        icon={<PawPrint className="size-5" />}
        columns={columns}
        data={pets}
        getRowId={(row) => row.id}
        searchPlaceholder="Search pets..."
        isLoading={isLoading}
        loadingLabel="Loading pets..."
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching && !isLoading}
        actions={addPetAction}
        emptyMessage="No pets added yet."
        emptyDescription="Add a pet to keep their veterinary information with your health account."
        filteredEmptyDescription="No pets match your search. Try adjusting it."
        emptyAction={addPetAction}
      />

      <PetSharingDialog
        pet={sharingPet}
        open={sharingOpen}
        onOpenChange={setSharingOpen}
      />
    </>
  )
}
