"use client"

import { useQueryClient } from "@tanstack/react-query"
import type { Route } from "next"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"

import {
  getPetOwnerDefaults,
  type PetFormValues,
  petDefaultValues,
  petFormValuesToPayload,
} from "@/app/(dashboards)/patient/_lib/pets"
import PetForm from "@/app/(dashboards)/patient/family-members/_components/pet-form"
import useApi from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import {
  FAMILY_MEMBERS_API,
  FAMILY_MEMBERS_QUERY_KEYS,
  type FamilyMembersListResponse,
} from "@/lib/api/family-members"
import {
  PATIENT_PROFILE_API,
  PATIENT_PROFILE_QUERY_KEYS,
  type PatientProfileResponse,
} from "@/lib/api/patient-profile"
import {
  type CreatePetPayload,
  PETS_API,
  PETS_QUERY_KEYS,
} from "@/lib/api/pets"

export default function NewPetPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const isAccountOwner = !user?.isFamilyMemberAccount

  const { data: profile } = useFetch<PatientProfileResponse>({
    path: PATIENT_PROFILE_API.get,
    queryKey: PATIENT_PROFILE_QUERY_KEYS.profile,
    enabled: Boolean(user) && isAccountOwner,
  })

  const { data: membersData } = useFetch<FamilyMembersListResponse>({
    path: FAMILY_MEMBERS_API.list,
    queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
    enabled: isAccountOwner,
  })

  const { onRequest: createPet, isPending } = useApi<CreatePetPayload>({
    key: "create-pet",
    method: "post",
  })

  const defaultValues = useMemo<PetFormValues>(() => {
    if (!user) return petDefaultValues

    return {
      ...petDefaultValues,
      ...getPetOwnerDefaults(user, profile),
    }
  }, [profile, user])

  useEffect(() => {
    if (!user) return
    if (!isAccountOwner) {
      router.replace("/patient")
    }
  }, [isAccountOwner, router, user])

  function handleSubmit(values: PetFormValues) {
    createPet({
      path: PETS_API.create,
      data: petFormValuesToPayload(values),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEYS.list })
        router.push("/patient/pets" as Route)
      },
    })
  }

  if (!user || !isAccountOwner) {
    return null
  }

  return (
    <PetForm
      title="Add Pet"
      description="Add your pet's photo, medical details, owner contact, veterinarian, and emergency information."
      submitLabel="Save Pet"
      isSubmitting={isPending}
      familyMembers={(membersData?.members ?? []).filter(
        (member) => member.isAccessible
      )}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
    />
  )
}
