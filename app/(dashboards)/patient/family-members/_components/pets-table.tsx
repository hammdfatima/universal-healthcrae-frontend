"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Eye, PawPrint, Plus } from "lucide-react"
import type { Route } from "next"
import { useRouter } from "next/navigation"
import { useState } from "react"

import PetDetailsDialog from "@/app/(dashboards)/patient/family-members/_components/pet-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { FAMILY_MEMBERS_QUERY_KEYS } from "@/lib/api/family-members"
import type { Pet } from "@/lib/api/pets"
import {
  PETS_API,
  PETS_QUERY_KEYS,
  type PetsListResponse,
} from "@/lib/api/pets"

type PetsTableProps = {
  canAdd: boolean
  limit: number
  usedSeats: number
  isCouplePlan: boolean
}

export default function PetsTable({
  canAdd,
  limit,
  usedSeats,
  isCouplePlan,
}: PetsTableProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useFetch<PetsListResponse>({
      path: PETS_API.list,
      queryKey: PETS_QUERY_KEYS.list,
    })

  const pets = data?.pets ?? []

  const { onRequest: deletePet, isPending: isDeleting } = useApi<
    Record<string, never>
  >({
    key: "delete-pet",
    method: "delete",
  })

  function openDetails(pet: Pet) {
    setSelectedPet(pet)
    setDetailsOpen(true)
  }

  function handleDelete(pet: Pet) {
    deletePet({
      path: PETS_API.delete(pet.id),
      data: {},
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEYS.list })
        queryClient.invalidateQueries({
          queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
        })
        refetch()
      },
    })
  }

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
      className: "hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
      cell: (row) => row.breed ?? "—",
    },
    {
      id: "clinic",
      header: "Vet Clinic",
      className: "hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
      cell: (row) => row.veterinaryClinic ?? "—",
    },
    {
      id: "emergency",
      header: "Emergency Contact",
      cell: (row) =>
        row.emergencyContact
          ? `${row.emergencyContact.firstName} ${row.emergencyContact.lastName}`
          : "—",
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

  const addPetAction = canAdd ? (
    <Button
      onClick={() => router.push("/patient/family-members/pets/new" as Route)}
    >
      <Plus className="size-4" aria-hidden />
      Add Pet
    </Button>
  ) : undefined

  return (
    <>
      <DataTable
        title="Pets"
        description="Store veterinary records, vaccinations, medications, allergies, and emergency contacts for your pets. Pets count toward your plan seats but do not get separate login accounts."
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
        emptyDescription="Add a pet to keep their veterinary information in your family account."
        filteredEmptyDescription="No pets match your search. Try adjusting it."
        emptyAction={addPetAction}
      />

      {!canAdd ? (
        <Typography variant="muted" className="ml-6 text-sm">
          {isCouplePlan
            ? "Your couple's plan allows only one household profile. Remove a profile to add a pet."
            : `Your family plan supports up to ${limit} household members including pets (${usedSeats}/${limit} used).`}
        </Typography>
      ) : null}

      <PetDetailsDialog
        pet={selectedPet}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}
