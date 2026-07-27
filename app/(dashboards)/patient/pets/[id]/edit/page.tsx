"use client"

import { useQueryClient } from "@tanstack/react-query"
import type { Route } from "next"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"

import {
  type PetFormValues,
  petFormValuesToPayload,
  petToFormValues,
} from "@/app/(dashboards)/patient/_lib/pets"
import PetForm from "@/app/(dashboards)/patient/family-members/_components/pet-form"
import { Loader } from "@/components/ui/loader"
import useApi from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import {
  FAMILY_MEMBERS_API,
  FAMILY_MEMBERS_QUERY_KEYS,
  type FamilyMembersListResponse,
} from "@/lib/api/family-members"
import {
  PETS_API,
  PETS_QUERY_KEYS,
  type PetsListResponse,
  type UpdatePetPayload,
} from "@/lib/api/pets"

export default function EditPetPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const petId = params.id
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const isAccountOwner = !user?.isFamilyMemberAccount

  const { data: petsData, isLoading: isPetsLoading } =
    useFetch<PetsListResponse>({
      path: PETS_API.list,
      queryKey: PETS_QUERY_KEYS.list,
      enabled: isAccountOwner,
    })

  const { data: membersData } = useFetch<FamilyMembersListResponse>({
    path: FAMILY_MEMBERS_API.list,
    queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
    enabled: isAccountOwner,
  })

  const pet = useMemo(
    () => petsData?.pets.find((item) => item.id === petId) ?? null,
    [petId, petsData?.pets]
  )

  const { onRequest: updatePet, isPending } = useApi<UpdatePetPayload>({
    key: "update-pet",
    method: "patch",
  })

  useEffect(() => {
    if (!user) return
    if (!isAccountOwner) {
      router.replace("/patient")
      return
    }
    if (isPetsLoading) return
    if (!pet) {
      router.replace("/patient/pets" as Route)
    }
  }, [isAccountOwner, isPetsLoading, pet, router, user])

  function handleSubmit(values: PetFormValues) {
    if (!pet) return

    updatePet({
      path: PETS_API.update(pet.id),
      data: petFormValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEYS.list })
        router.push(`/patient/pets/${pet.id}` as Route)
      },
    })
  }

  if (!user || !isAccountOwner || isPetsLoading || !pet) {
    return <Loader variant="fetch" label="Loading pet..." />
  }

  return (
    <PetForm
      title={`Edit ${pet.name}`}
      description="Update your pet's photo, medical details, owner contact, veterinarian, and emergency information."
      submitLabel="Save Changes"
      isSubmitting={isPending}
      familyMembers={(membersData?.members ?? []).filter(
        (member) => member.isAccessible
      )}
      defaultValues={petToFormValues(pet)}
      onSubmit={handleSubmit}
    />
  )
}
