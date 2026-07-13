import { Suspense } from "react"

import FamilyMembersPageContent from "@/app/(dashboards)/patient/family-members/_components/family-members-page-content"
import { Loader } from "@/components/ui/loader"

export default function FamilyMembersPage() {
  return (
    <Suspense fallback={<Loader variant="fetch" label="Loading family..." />}>
      <FamilyMembersPageContent />
    </Suspense>
  )
}
