import { Suspense } from "react"

import PetDetailPageContent from "@/app/(dashboards)/patient/pets/_components/pet-detail-page-content"
import { Loader } from "@/components/ui/loader"

export default function PetDetailPage() {
  return (
    <Suspense fallback={<Loader variant="fetch" label="Loading pet..." />}>
      <PetDetailPageContent />
    </Suspense>
  )
}
