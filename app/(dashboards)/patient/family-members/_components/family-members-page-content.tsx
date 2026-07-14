"use client"

import { PawPrint, Users } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import FamilyMembersTable from "@/app/(dashboards)/patient/family-members/_components/family-members-table"
import HouseholdFamilyTable from "@/app/(dashboards)/patient/family-members/_components/household-family-table"
import PetsTable from "@/app/(dashboards)/patient/family-members/_components/pets-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Typography } from "@/components/ui/typography"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import { useSubscriptionPlan } from "@/hooks/use-subscription-plan"
import {
  FAMILY_MEMBERS_API,
  FAMILY_MEMBERS_QUERY_KEYS,
  type FamilyMembersListResponse,
} from "@/lib/api/family-members"
import { cn } from "@/lib/utils"

const validTabs = ["members", "pets"] as const
type FamilyTab = (typeof validTabs)[number]

function isFamilyTab(value: string | null): value is FamilyTab {
  return validTabs.includes(value as FamilyTab)
}

const tabTriggerClass = cn(
  "rounded-full px-4 py-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground",
  "text-foreground/75 hover:bg-secondary/60 hover:text-secondary-foreground"
)

export default function FamilyMembersPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState<FamilyTab>(
    isFamilyTab(tabParam) ? tabParam : "members"
  )

  const { user } = useAuth()
  const {
    tier,
    isLoading: isPlanLoading,
    supportsFamilyMembers,
    supportsPets,
    memberLimit,
  } = useSubscriptionPlan()
  const isCouplePlan = tier === "couple"
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
  const petsSupported = data?.supportsPets ?? supportsPets
  const pausedMemberCount =
    data?.members.filter((member) => !member.isAccessible).length ?? 0
  const pausedPetCount = data?.pausedPetCount ?? 0
  const canAdd = canManage && usedSeats < limit

  useEffect(() => {
    if (isFamilyTab(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  useEffect(() => {
    if (isPlanLoading) return
    if (isManagedMember) return
    // Keep account owners on this page even on Individual so they can see paused profiles.
    if (!isAccountOwner) {
      router.replace("/patient")
    }
  }, [isAccountOwner, isManagedMember, isPlanLoading, router])

  function handleTabChange(value: string) {
    const nextTab = isFamilyTab(value) ? value : "members"
    setActiveTab(nextTab)
    const params = new URLSearchParams(searchParams.toString())
    if (nextTab === "members") {
      params.delete("tab")
    } else {
      params.set("tab", nextTab)
    }
    const query = params.toString()
    router.replace(
      query ? `/patient/family-members?${query}` : "/patient/family-members"
    )
  }

  if (isManagedMember) {
    return <HouseholdFamilyTable />
  }

  if (!isPlanLoading && !isAccountOwner) {
    return null
  }

  return (
    <div className="space-y-4">
      {pausedMemberCount > 0 || pausedPetCount > 0 ? (
        <div className="mx-4 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 sm:mx-0">
          <Typography variant="small" className="font-medium">
            Some household profiles are paused on your current plan
          </Typography>
          <Typography variant="muted" className="mt-1 text-sm">
            {pausedMemberCount > 0
              ? `${pausedMemberCount} family member${pausedMemberCount === 1 ? "" : "s"} inactive. `
              : null}
            {pausedPetCount > 0
              ? `${pausedPetCount} pet${pausedPetCount === 1 ? "" : "s"} hidden until you upgrade to Family. `
              : null}
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

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="thin-scrollbar mx-4 mt-2 h-auto w-[calc(100%-2rem)] justify-start gap-1 overflow-x-auto rounded-2xl border border-border/60 bg-muted/40 p-1.5 sm:w-fit">
          <TabsTrigger value="members" className={tabTriggerClass}>
            <Users className="mr-2 size-4" aria-hidden />
            {isCouplePlan ? "Spouse" : "Family Members"}
          </TabsTrigger>
          <TabsTrigger value="pets" className={tabTriggerClass}>
            <PawPrint className="mr-2 size-4" aria-hidden />
            Pets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-0">
          <FamilyMembersTable
            canAdd={canAdd}
            canManage={canManage}
            limit={limit}
            usedSeats={usedSeats}
          />
        </TabsContent>

        <TabsContent value="pets" className="mt-0">
          <PetsTable
            canAdd={canAdd && petsSupported}
            limit={limit}
            usedSeats={usedSeats}
            supportsPets={petsSupported}
            pausedPetCount={pausedPetCount}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
