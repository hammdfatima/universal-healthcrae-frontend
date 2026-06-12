"use client"

import {
  type FamilyMemberFormValues,
  formValuesToFamilyMember,
  getFamilyMembersFromStorage,
  saveFamilyMembersToStorage,
} from "@/app/(dashboards)/patient/_lib/family-members"
import FamilyMemberForm from "@/app/(dashboards)/patient/family-members/_components/family-member-form"

export default function NewFamilyMemberPage() {
  function handleSubmit(values: FamilyMemberFormValues) {
    const members = getFamilyMembersFromStorage()
    const newMember = formValuesToFamilyMember(values, crypto.randomUUID())
    saveFamilyMembersToStorage([...members, newMember])
  }

  return (
    <FamilyMemberForm
      title="Add Family Member"
      description="Add a family member to your health profile and optionally mark them as an emergency contact."
      submitLabel="Save Member"
      onSubmit={handleSubmit}
    />
  )
}
