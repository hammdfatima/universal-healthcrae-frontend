"use client"

import { Eye, Plus, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  type FamilyMember,
  getFamilyMembersFromStorage,
  initialFamilyMembers,
  relationshipOptions,
  saveFamilyMembersToStorage,
} from "@/app/(dashboards)/patient/_lib/family-members"
import FamilyMemberDetailsDialog from "@/app/(dashboards)/patient/family-members/_components/family-member-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function FamilyMembersTable() {
  const router = useRouter()
  const [members, setMembers] = useState<FamilyMember[]>(initialFamilyMembers)
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null
  )
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    setMembers(getFamilyMembersFromStorage())
  }, [])

  function updateMembers(next: FamilyMember[]) {
    setMembers(next)
    saveFamilyMembersToStorage(next)
  }

  function openDetails(member: FamilyMember) {
    setSelectedMember(member)
    setDetailsOpen(true)
  }

  function handleMarkEmergencyContact(member: FamilyMember) {
    const next = members.map((item) =>
      item.id === member.id
        ? { ...item, isEmergencyContact: !item.isEmergencyContact }
        : item
    )
    updateMembers(next)
    setSelectedMember(next.find((item) => item.id === member.id) ?? null)
  }

  function handleDelete(member: FamilyMember) {
    updateMembers(members.filter((item) => item.id !== member.id))
    setSelectedMember(null)
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

  return (
    <>
      <DataTable
        title="My Family"
        description="Manage family members linked to your health records and emergency contacts."
        icon={<Users className="size-5" />}
        columns={columns}
        data={members}
        getRowId={(row) => row.id}
        searchPlaceholder="Search family members..."
        filters={[
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
        ]}
        actions={
          <Button onClick={() => router.push("/patient/family-members/new")}>
            <Plus className="size-4" aria-hidden />
            Add Family Member
          </Button>
        }
        emptyMessage="No family members found. Add your first family member to get started."
      />

      <FamilyMemberDetailsDialog
        member={selectedMember}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onMarkEmergencyContact={handleMarkEmergencyContact}
        onDelete={handleDelete}
      />
    </>
  )
}
