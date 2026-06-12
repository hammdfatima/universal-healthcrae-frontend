"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import {
  type FamilyMember,
  type FamilyMemberFormValues,
  formValuesToFamilyMember,
  getFamilyMemberById,
  getFamilyMembersFromStorage,
  memberToFormValues,
  saveFamilyMembersToStorage,
} from "@/app/(dashboards)/patient/_lib/family-members"
import FamilyMemberForm from "@/app/(dashboards)/patient/family-members/_components/family-member-form"
import { Typography } from "@/components/ui/typography"

export default function EditFamilyMemberPage() {
  const params = useParams<{ id: string }>()
  const [member, setMember] = useState<FamilyMember | null>(null)

  useEffect(() => {
    const found = getFamilyMemberById(params.id)
    setMember(found ?? null)
  }, [params.id])

  function handleSubmit(values: FamilyMemberFormValues) {
    if (!member) return

    const members = getFamilyMembersFromStorage()
    const updated = formValuesToFamilyMember(values, member.id)
    const next = members.map((item) => (item.id === member.id ? updated : item))
    saveFamilyMembersToStorage(next)
  }

  if (!member) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <Typography variant="h4">Family member not found</Typography>
        <Typography variant="muted" className="mt-2">
          This family member may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <FamilyMemberForm
      key={member.id}
      title="Edit Family Member"
      description={`Update details for ${member.firstName} ${member.lastName}.`}
      defaultValues={memberToFormValues(member)}
      submitLabel="Save Changes"
      onSubmit={handleSubmit}
    />
  )
}
