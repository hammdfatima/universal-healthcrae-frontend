"use client"

import { FileText, Share2, Shield } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

import ReviewRecordsDialog from "@/app/(dashboards)/patient/_components/review-records-dialog"
import {
  DEFAULT_HEALTH_RECORD_TAB,
  HEALTH_RECORD_TABS,
  type HealthRecordTab,
  healthRecordHref,
  isHealthRecordTab,
} from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import { useMedicalVaultCounts } from "@/app/(dashboards)/patient/_lib/use-medical-vault-counts"
import AllergiesTable from "@/app/(dashboards)/patient/allergies/_components/allergies-table"
import FamilyLifestyleHistoryPanel from "@/app/(dashboards)/patient/family-lifestyle-history/_components/family-lifestyle-history-panel"
import HealthHistoryTable from "@/app/(dashboards)/patient/health-history/_components/health-history-table"
import ShareRecordsDialog from "@/app/(dashboards)/patient/health-record/_components/share-records-dialog"
import ImagingResultsTable from "@/app/(dashboards)/patient/imaging/_components/imaging-results-table"
import LabResultsTable from "@/app/(dashboards)/patient/lab/_components/lab-results-table"
import MedicationsTable from "@/app/(dashboards)/patient/medications/_components/medications-table"
import PharmaciesTable from "@/app/(dashboards)/patient/pharmacy/_components/pharmacies-table"
import VaccinationsTable from "@/app/(dashboards)/patient/vaccinations/_components/vaccinations-table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

const tabTriggerClass = cn(
  "rounded-full px-3 py-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground",
  "text-foreground/75 hover:bg-secondary/60 hover:text-secondary-foreground sm:px-4"
)

function HealthRecordTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const { counts } = useMedicalVaultCounts()
  const [activeTab, setActiveTab] = useState<HealthRecordTab>(
    isHealthRecordTab(tabParam) ? tabParam : DEFAULT_HEALTH_RECORD_TAB
  )
  const [shareOpen, setShareOpen] = useState(false)
  const [recordsOpen, setRecordsOpen] = useState(false)

  useEffect(() => {
    if (isHealthRecordTab(tabParam)) {
      setActiveTab(tabParam)
    } else if (!tabParam) {
      setActiveTab(DEFAULT_HEALTH_RECORD_TAB)
    }
  }, [tabParam])

  function handleTabChange(value: string) {
    if (!isHealthRecordTab(value)) return

    setActiveTab(value)
    router.replace(healthRecordHref(value))
  }

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Shield className="size-6" aria-hidden />
            </span>
            <div>
              <Typography as="h1" variant="h3">
                Health Record
              </Typography>
              <Typography variant="muted" className="mt-1">
                View and manage medications, allergies, history, lifestyle, test
                results, and preferred pharmacies in one place.
              </Typography>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="gap-1.5"
              onClick={() => setRecordsOpen(true)}
            >
              <FileText className="size-4" aria-hidden />
              Review Records
            </Button>
            <Button
              type="button"
              className="gap-1.5"
              onClick={() => setShareOpen(true)}
            >
              <Share2 className="size-4" aria-hidden />
              Share Records
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="gap-6"
        >
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-full bg-muted/60 p-1">
            {HEALTH_RECORD_TABS.map((tab) => {
              const Icon = tab.icon
              const count = counts[tab.countKey]

              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={tabTriggerClass}
                >
                  <Icon className="size-3.5 shrink-0" aria-hidden />
                  <span>{tab.label}</span>
                  <span className="rounded-full bg-background/70 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums">
                    {count}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value="medications" className="mt-0">
            <MedicationsTable />
          </TabsContent>
          <TabsContent value="allergies" className="mt-0">
            <AllergiesTable />
          </TabsContent>
          <TabsContent value="health-history" className="mt-0">
            <HealthHistoryTable />
          </TabsContent>
          <TabsContent value="immunizations" className="mt-0">
            <VaccinationsTable />
          </TabsContent>
          <TabsContent value="laboratory" className="mt-0">
            <LabResultsTable />
          </TabsContent>
          <TabsContent value="imaging" className="mt-0">
            <ImagingResultsTable />
          </TabsContent>
          <TabsContent value="pharmacy" className="mt-0">
            <PharmaciesTable />
          </TabsContent>
          <TabsContent value="family-lifestyle" className="mt-0">
            <FamilyLifestyleHistoryPanel />
          </TabsContent>
        </Tabs>
      </div>

      <ShareRecordsDialog open={shareOpen} onOpenChange={setShareOpen} />
      <ReviewRecordsDialog open={recordsOpen} onOpenChange={setRecordsOpen} />
    </>
  )
}

export default function HealthRecordPageContent() {
  return (
    <Suspense fallback={null}>
      <HealthRecordTabs />
    </Suspense>
  )
}
