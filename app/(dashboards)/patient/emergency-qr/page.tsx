import { Suspense } from "react"

import EmergencyQrPageContent from "@/app/(dashboards)/patient/emergency-qr/_components/emergency-qr-page-content"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"

export default function EmergencyQrPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl space-y-6">
          <Typography variant="h3">Emergency QR Access</Typography>
          <Loader
            variant="fetch"
            label="Loading emergency QR..."
            className="min-h-[50vh] py-16"
          />
        </div>
      }
    >
      <EmergencyQrPageContent />
    </Suspense>
  )
}
