"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"

import {
  type FamilyMemberFormValues,
  formatFamilyMemberDate,
  memberToFormValues,
} from "@/app/(dashboards)/patient/_lib/family-members"
import FamilyMemberForm from "@/app/(dashboards)/patient/family-members/_components/family-member-form"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { useSubscriptionPlan } from "@/hooks/use-subscription-plan"
import {
  FAMILY_MEMBERS_API,
  FAMILY_MEMBERS_QUERY_KEYS,
  type FamilyMembersListResponse,
  type UpdateFamilyMemberPayload,
} from "@/lib/api/family-members"

export default function EditFamilyMemberPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    tier,
    isLoading: isPlanLoading,
    supportsFamilyMembers,
  } = useSubscriptionPlan()
  const isCouplePlan = tier === "couple"

  const { data, isLoading: isMembersLoading } =
    useFetch<FamilyMembersListResponse>({
      path: FAMILY_MEMBERS_API.list,
      queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
    })

  const member = useMemo(
    () => data?.members.find((item) => item.id === params.id) ?? null,
    [data?.members, params.id]
  )

  const { onRequest: updateFamilyMember, isPending } =
    useApi<UpdateFamilyMemberPayload>({
      key: "update-family-member",
      method: "patch",
    })

  useEffect(() => {
    if (isPlanLoading || isMembersLoading) return

    if (!supportsFamilyMembers) {
      router.replace("/patient/family-members")
      return
    }

    if (member && !member.isAccessible) {
      router.replace("/patient/family-members")
    }
  }, [isMembersLoading, isPlanLoading, member, router, supportsFamilyMembers])

  function handleSubmit(values: FamilyMemberFormValues) {
    if (!member) return

    updateFamilyMember({
      path: FAMILY_MEMBERS_API.update(member.id),
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        relationship: isCouplePlan ? "Spouse" : values.relationship,
        dateOfBirth: formatFamilyMemberDate(values.dateOfBirth),
        isEmergencyContact: values.isEmergencyContact,
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
        })
        router.push("/patient/family-members")
      },
    })
  }

  if (
    isPlanLoading ||
    isMembersLoading ||
    !supportsFamilyMembers ||
    (member && !member.isAccessible)
  ) {
    return <Loader variant="full-page" label="Loading family member..." />
  }

  if (!member) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <Typography variant="h4">
          {isCouplePlan ? "Spouse not found" : "Family member not found"}
        </Typography>
        <Typography variant="muted" className="mt-2">
          {isCouplePlan
            ? "This spouse profile may have been removed or the link is invalid."
            : "This family member may have been removed or the link is invalid."}
        </Typography>
      </div>
    )
  }

  return (
    <FamilyMemberForm
      key={member.id}
      title={isCouplePlan ? "Edit Spouse" : "Edit Family Member"}
      description={`Update details for ${member.firstName} ${member.lastName}.`}
      defaultValues={memberToFormValues(member)}
      submitLabel="Save Changes"
      isCouplePlan={isCouplePlan}
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  )
}
