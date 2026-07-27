"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import FamilyMembersTable from "@/app/(dashboards)/patient/family-members/_components/family-members-table"
import HouseholdFamilyTable from "@/app/(dashboards)/patient/family-members/_components/household-family-table"
import { Typography } from "@/components/ui/typography"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import { useSubscriptionPlan } from "@/hooks/use-subscription-plan"
import {
  FAMILY_MEMBERS_API,
  FAMILY_MEMBERS_QUERY_KEYS,
  type FamilyMembersListResponse,
} from "@/lib/api/family-members"

export default function FamilyMembersPageContent() {
  const router = useRouter()

  const { user } = useAuth()
  const {
    isLoading: isPlanLoading,
    supportsFamilyMembers,
    memberLimit,
  } = useSubscriptionPlan()
  const isAccountOwner = !user?.isFamilyMemberAccount
  const isManagedMember = Boolean(user?.isFamilyMemberAccount)

  const { data } = useFetch<FamilyMembersListResponse>({
    path: FAMILY_MEMBERS_API.list,
    queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
    enabled: isAccountOwner && !isPlanLoading,
  })

  const limit = data?.limit ?? memberLimit
  const usedSeats = data?.usedSeats ?? 0
  const canManage = data?.canManage ?? supportsFamilyMembers
  const pausedMemberCount =
    data?.members.filter((member) => !member.isAccessible).length ?? 0
  const canAdd = canManage && usedSeats < limit

  useEffect(() => {
    if (isPlanLoading) return
    if (isManagedMember) return
    // Keep account owners on this page even on Individual so they can see paused profiles.
    if (!isAccountOwner) {
      router.replace("/patient")
    }
  }, [isAccountOwner, isManagedMember, isPlanLoading, router])

  if (isManagedMember) {
    return <HouseholdFamilyTable />
  }

  if (!isPlanLoading && !isAccountOwner) {
    return null
  }

  return (
    <div className="space-y-4">
      {pausedMemberCount > 0 ? (
        <div className="mx-4 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 sm:mx-0">
          <Typography variant="small" className="font-medium">
            Some household profiles are paused on your current plan
          </Typography>
          <Typography variant="muted" className="mt-1 text-sm">
            {`${pausedMemberCount} family member${pausedMemberCount === 1 ? "" : "s"} inactive. `}
            Upgrade to restore login access and medical vault sharing.
          </Typography>
          <button
            type="button"
            className="mt-2 text-sm font-medium text-primary hover:underline"
            onClick={() => router.push("/patient/settings?tab=subscription")}
          >
            Upgrade subscription
          </button>
        </div>
      ) : null}

      <FamilyMembersTable
        canAdd={canAdd}
        canManage={canManage}
        limit={limit}
        usedSeats={usedSeats}
      />
    </div>
  )
}
