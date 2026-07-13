"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import {
  type FamilyMemberCreateFormValues,
  type FamilyMemberFormValues,
  formatFamilyMemberDate,
} from "@/app/(dashboards)/patient/_lib/family-members"
import FamilyMemberForm from "@/app/(dashboards)/patient/family-members/_components/family-member-form"
import useApi from "@/hooks/use-api"
import { useSubscriptionPlan } from "@/hooks/use-subscription-plan"
import {
  type CreateFamilyMemberPayload,
  FAMILY_MEMBERS_API,
  FAMILY_MEMBERS_QUERY_KEYS,
} from "@/lib/api/family-members"
import { PETS_QUERY_KEYS } from "@/lib/api/pets"
import { generateTemporaryPassword } from "@/lib/auth/generate-password"

export default function NewFamilyMemberPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { tier, isLoading, supportsFamilyMembers, pageCopy } =
    useSubscriptionPlan()
  const isCouplePlan = tier === "couple"

  const { onRequest: createFamilyMember, isPending } =
    useApi<CreateFamilyMemberPayload>({
      key: "create-family-member",
      method: "post",
    })

  useEffect(() => {
    if (isLoading) return

    if (!supportsFamilyMembers) {
      router.replace("/patient")
    }
  }, [isLoading, router, supportsFamilyMembers])

  function handleSubmit(
    values: FamilyMemberFormValues | FamilyMemberCreateFormValues
  ) {
    if (!("password" in values)) {
      return
    }

    createFamilyMember({
      path: FAMILY_MEMBERS_API.create,
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        relationship: isCouplePlan ? "Spouse" : values.relationship,
        dateOfBirth: formatFamilyMemberDate(values.dateOfBirth),
        password: values.password,
        isEmergencyContact: values.isEmergencyContact,
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
        })
        queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEYS.list })
        router.push("/patient/family-members")
      },
    })
  }

  if (isLoading || !supportsFamilyMembers) {
    return null
  }

  return (
    <FamilyMemberForm
      mode="create"
      title={pageCopy.addTitle}
      description={pageCopy.addDescription}
      submitLabel={pageCopy.saveLabel}
      isCouplePlan={isCouplePlan}
      isSubmitting={isPending}
      defaultValues={{
        firstName: "",
        lastName: "",
        relationship: isCouplePlan ? "Spouse" : "",
        dateOfBirth: undefined as unknown as Date,
        phone: "",
        email: "",
        password: generateTemporaryPassword(),
        isEmergencyContact: false,
      }}
      onSubmit={handleSubmit}
    />
  )
}
