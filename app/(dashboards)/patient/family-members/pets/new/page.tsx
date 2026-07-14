"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import {
  formatPetDate,
  type PetFormValues,
} from "@/app/(dashboards)/patient/_lib/pets"
import PetForm from "@/app/(dashboards)/patient/family-members/_components/pet-form"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { useSubscriptionPlan } from "@/hooks/use-subscription-plan"
import {
  FAMILY_MEMBERS_API,
  FAMILY_MEMBERS_QUERY_KEYS,
  type FamilyMembersListResponse,
} from "@/lib/api/family-members"
import {
  type CreatePetPayload,
  PETS_API,
  PETS_QUERY_KEYS,
} from "@/lib/api/pets"

export default function NewPetPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { isLoading, supportsPets } = useSubscriptionPlan()

  const { data: membersData } = useFetch<FamilyMembersListResponse>({
    path: FAMILY_MEMBERS_API.list,
    queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
    enabled: supportsPets && !isLoading,
  })

  const { onRequest: createPet, isPending } = useApi<CreatePetPayload>({
    key: "create-pet",
    method: "post",
  })

  useEffect(() => {
    if (isLoading) return
    if (!supportsPets) {
      router.replace("/patient/family-members?tab=pets")
    }
  }, [isLoading, router, supportsPets])

  function handleSubmit(values: PetFormValues) {
    createPet({
      path: PETS_API.create,
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

  if (isLoading || !supportsPets) {
    return null
  }

  return (
    <PetForm
      title="Add Pet"
      description="Add a pet to your family account. Pets count toward your plan seats but do not receive a separate login."
      submitLabel="Save Pet"
      isSubmitting={isPending}
      familyMembers={(membersData?.members ?? []).filter(
        (member) => member.isAccessible
      )}
      onSubmit={handleSubmit}
    />
  )
}
