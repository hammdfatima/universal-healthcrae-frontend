import { Suspense } from "react"
import SettingsPageContent from "@/app/(dashboards)/patient/settings/_components/settings-page-content"
import { Loader } from "@/components/ui/loader"

export default function SettingsPage() {
  return (
    <Suspense
      fallback={<Loader variant="full-page" label="Loading settings..." />}
    >
      <SettingsPageContent />
    </Suspense>
  )
}
