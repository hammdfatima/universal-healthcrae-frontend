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
  supportsPets: boolean
  pausedPetCount: number
}

export default function PetsTable({
  canAdd,
  limit,
  usedSeats,
  supportsPets,
  pausedPetCount,
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
  const effectivePausedCount = data?.pausedPetCount ?? pausedPetCount

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

  if (!supportsPets) {
    return (
      <div className="mx-4 space-y-3 rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:mx-0">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
            <PawPrint className="size-5 text-muted-foreground" aria-hidden />
          </span>
          <div>
            <Typography variant="small" className="font-semibold">
              Pets require a Family plan
            </Typography>
            <Typography variant="muted" className="text-sm">
              {effectivePausedCount > 0
                ? `${effectivePausedCount} pet profile${effectivePausedCount === 1 ? "" : "s"} saved and hidden. Upgrade to Family to view and manage them again.`
                : "Pet profiles are only available on the Family plan."}
            </Typography>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/patient/settings?tab=subscription")}
        >
          Upgrade to Family
        </Button>
      </div>
    )
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
            aria-label={`View ${row.name}`}
            onClick={() => openDetails(row)}
          >
            <Eye className="size-4" aria-hidden />
          </Button>
        </div>
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
        description="Manage pet profiles linked to your family health account."
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
          {`Your family plan supports up to ${limit} household members including pets (${usedSeats}/${limit} used).`}
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
