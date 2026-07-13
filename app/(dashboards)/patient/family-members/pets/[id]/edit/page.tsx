"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"

import {
  formatPetDate,
  type PetFormValues,
  petToFormValues,
} from "@/app/(dashboards)/patient/_lib/pets"
import PetForm from "@/app/(dashboards)/patient/family-members/_components/pet-form"
import { Loader } from "@/components/ui/loader"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { useSubscriptionPlan } from "@/hooks/use-subscription-plan"
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
  const { isLoading: isPlanLoading, supportsFamilyMembers } =
    useSubscriptionPlan()

  const { data: petsData, isLoading: isPetsLoading } =
    useFetch<PetsListResponse>({
      path: PETS_API.list,
      queryKey: PETS_QUERY_KEYS.list,
      enabled: supportsFamilyMembers && !isPlanLoading,
    })

  const { data: membersData } = useFetch<FamilyMembersListResponse>({
    path: FAMILY_MEMBERS_API.list,
    queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
    enabled: supportsFamilyMembers && !isPlanLoading,
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
    if (isPlanLoading || isPetsLoading) return
    if (!supportsFamilyMembers) {
      router.replace("/patient")
      return
    }
    if (!pet) {
      router.replace("/patient/family-members?tab=pets")
    }
  }, [isPetsLoading, isPlanLoading, pet, router, supportsFamilyMembers])

  function handleSubmit(values: PetFormValues) {
    if (!pet) return

    updatePet({
      path: PETS_API.update(pet.id),
      data: {
        name: values.name,
        species: values.species,
        breed: values.breed ?? "",
        sex: values.sex ?? "",
        color: values.color ?? "",
        dateOfBirth: values.dateOfBirth
          ? formatPetDate(values.dateOfBirth)
          : "",
        microchipId: values.microchipId ?? "",
        veterinaryClinic: values.veterinaryClinic ?? "",
        veterinaryPhone: values.veterinaryPhone ?? "",
        veterinaryRecords: values.veterinaryRecords ?? "",
        medications: values.medications,
        allergies: values.allergies,
        vaccinations: values.vaccinations.map((item) => ({
          name: item.name,
          notes: item.notes ?? "",
          dateGiven: item.dateGiven ? formatPetDate(item.dateGiven) : "",
          nextDue: item.nextDue ? formatPetDate(item.nextDue) : "",
        })),
        emergencyContactFamilyMemberId: values.emergencyContactFamilyMemberId,
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEYS.list })
        queryClient.invalidateQueries({
          queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
        })
        router.push("/patient/family-members?tab=pets")
      },
    })
  }

  if (isPlanLoading || isPetsLoading || !pet) {
    return <Loader variant="fetch" label="Loading pet..." />
  }

  return (
    <PetForm
      title={`Edit ${pet.name}`}
      description="Update veterinary records, medications, allergies, vaccinations, and emergency contact."
      submitLabel="Save Changes"
      isSubmitting={isPending}
      familyMembers={membersData?.members ?? []}
      defaultValues={petToFormValues(pet)}
      onSubmit={handleSubmit}
    />
  )
}
