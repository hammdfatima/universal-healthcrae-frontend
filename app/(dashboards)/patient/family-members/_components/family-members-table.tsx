"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Eye, Plus, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { relationshipOptions } from "@/app/(dashboards)/patient/_lib/family-members"
import FamilyMemberDetailsDialog from "@/app/(dashboards)/patient/family-members/_components/family-member-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import { useSubscriptionPlan } from "@/hooks/use-subscription-plan"
import type { FamilyMember } from "@/lib/api/family-members"
import {
  FAMILY_MEMBERS_API,
  FAMILY_MEMBERS_QUERY_KEYS,
  type FamilyMembersListResponse,
  type UpdateFamilyMemberPayload,
} from "@/lib/api/family-members"

export default function FamilyMembersTable() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const {
    tier,
    isLoading: isPlanLoading,
    supportsFamilyMembers,
    memberLimit,
    pageCopy,
  } = useSubscriptionPlan()
  const isCouplePlan = tier === "couple"
  const isAccountOwner = !user?.isFamilyMemberAccount

  const {
    data,
    isLoading: isMembersLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useFetch<FamilyMembersListResponse>({
    path: FAMILY_MEMBERS_API.list,
    queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
    enabled: supportsFamilyMembers && isAccountOwner && !isPlanLoading,
  })

  const members = data?.members ?? []
  const limit = data?.limit ?? memberLimit
  const canAddMember = members.length < limit
  const isLoading =
    isPlanLoading ||
    (supportsFamilyMembers && isAccountOwner && isMembersLoading)

  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null
  )
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { onRequest: updateFamilyMember } = useApi<UpdateFamilyMemberPayload>({
    key: "update-family-member-inline",
    method: "patch",
    showSuccessToast: false,
  })

  const { onRequest: deleteFamilyMember, isPending: isDeleting } = useApi<
    Record<string, never>
  >({
    key: "delete-family-member",
    method: "delete",
  })

  useEffect(() => {
    if (isPlanLoading) return

    if (!supportsFamilyMembers || !isAccountOwner) {
      router.replace("/patient")
    }
  }, [isAccountOwner, isPlanLoading, router, supportsFamilyMembers])

  function openDetails(member: FamilyMember) {
    setSelectedMember(member)
    setDetailsOpen(true)
  }

  function handleMarkEmergencyContact(member: FamilyMember) {
    updateFamilyMember({
      path: FAMILY_MEMBERS_API.update(member.id),
      data: {
        firstName: member.firstName,
        lastName: member.lastName,
        phone: member.phone ?? "",
        relationship: member.relationship,
        dateOfBirth: member.dateOfBirth ?? "",
        isEmergencyContact: !member.isEmergencyContact,
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
        })
        refetch()
      },
    })
  }

  function handleDelete(member: FamilyMember) {
    deleteFamilyMember({
      path: FAMILY_MEMBERS_API.delete(member.id),
      data: {},
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
        })
        refetch()
      },
    })
  }

  const columns: DataTableColumn<FamilyMember>[] = [
    {
      id: "firstName",
      header: "First Name",
      accessorKey: "firstName",
      cell: (row) => (
        <Typography variant="small" className="font-medium">
          {row.firstName}
        </Typography>
      ),
    },
    {
      id: "lastName",
      header: "Last Name",
      accessorKey: "lastName",
    },
    {
      id: "relationship",
      header: "Relationship",
      accessorKey: "relationship",
    },
    {
      id: "phone",
      header: "Phone",
      accessorKey: "phone",
      className: "hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
      cell: (row) => row.phone ?? "—",
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      className: "hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "emergency",
      header: "Emergency",
      cell: (row) =>
        row.isEmergencyContact ? (
          <Badge className="rounded-full bg-destructive/10 text-destructive hover:bg-destructive/10">
            Yes
          </Badge>
        ) : (
          <Typography variant="muted" className="text-sm">
            No
          </Typography>
        ),
      searchable: false,
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
          aria-label={`View ${row.firstName} ${row.lastName}`}
          onClick={() => openDetails(row)}
        >
          <Eye className="size-4" aria-hidden />
        </Button>
      ),
    },
  ]

  if (!isPlanLoading && (!supportsFamilyMembers || !isAccountOwner)) {
    return null
  }

  const addMemberAction = canAddMember ? (
    <Button onClick={() => router.push("/patient/family-members/new")}>
      <Plus className="size-4" aria-hidden />
      {pageCopy.addButton}
    </Button>
  ) : undefined

  return (
    <>
      <DataTable
        title={pageCopy.title}
        description={pageCopy.description}
        icon={<Users className="size-5" />}
        columns={columns}
        data={members}
        getRowId={(row) => row.id}
        searchPlaceholder={pageCopy.searchPlaceholder}
        isLoading={isLoading}
        loadingLabel={
          isCouplePlan
            ? "Loading spouse profile..."
            : "Loading family members..."
        }
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching && !isMembersLoading}
        filters={
          isCouplePlan
            ? undefined
            : [
                {
                  id: "relationship",
                  label: "Relationship",
                  accessorKey: "relationship",
                  options: relationshipOptions.map((option) => ({
                    label: option.label,
                    value: option.value,
                  })),
                },
                {
                  id: "emergency",
                  label: "Emergency Contact",
                  filterFn: (row, value) => {
                    if (value === "yes") return row.isEmergencyContact
                    if (value === "no") return !row.isEmergencyContact
                    return true
                  },
                  options: [
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ],
                },
              ]
        }
        actions={addMemberAction}
        emptyMessage={pageCopy.emptyMessage}
        emptyDescription={
          isCouplePlan
            ? "Add your spouse to share access under your couple's plan."
            : "Add family members to link them to your health records and emergency contacts."
        }
        filteredEmptyDescription="No members match your search or filters. Try adjusting them."
        emptyAction={addMemberAction}
      />

      {!canAddMember ? (
        <Typography variant="muted" className="ml-6 text-sm">
          {isCouplePlan
            ? "Your couple's plan includes one spouse profile. Remove the existing profile to add a different spouse."
            : `Your family plan supports up to ${limit} family members.`}
        </Typography>
      ) : null}

      <FamilyMemberDetailsDialog
        member={selectedMember}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onMarkEmergencyContact={handleMarkEmergencyContact}
        onDelete={handleDelete}
        isCouplePlan={isCouplePlan}
        isDeleting={isDeleting}
      />
    </>
  )
}
