"use client"

import {
  Activity,
  AlertTriangle,
  FlaskConical,
  History,
  Lock,
  ScanLine,
  Syringe,
} from "lucide-react"

import EmptyCard from "@/components/empty-card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  ALLERGIES_API,
  ALLERGIES_QUERY_KEYS,
  type AllergiesListResponse,
} from "@/lib/api/allergies"
import {
  HEALTH_HISTORY_API,
  HEALTH_HISTORY_QUERY_KEYS,
  type HealthHistoryListResponse,
} from "@/lib/api/health-history"
import {
  IMAGING_RESULTS_API,
  IMAGING_RESULTS_QUERY_KEYS,
  type ImagingResultsListResponse,
} from "@/lib/api/imaging-results"
import {
  LAB_RESULTS_API,
  LAB_RESULTS_QUERY_KEYS,
  type LabResultsListResponse,
} from "@/lib/api/lab-results"
import type { SidebarFamilyMember } from "@/lib/api/medical-record-shares"
import {
  MEDICATIONS_API,
  MEDICATIONS_QUERY_KEYS,
  type MedicationsListResponse,
} from "@/lib/api/medications"
import {
  VACCINATIONS_API,
  VACCINATIONS_QUERY_KEYS,
  type VaccinationsListResponse,
} from "@/lib/api/vaccinations"

type SharedMedicalRecordsDialogProps = {
  member: SidebarFamilyMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function withPatient(path: string, patientUserId: string) {
  const separator = path.includes("?") ? "&" : "?"
  return `${path}${separator}patientUserId=${encodeURIComponent(patientUserId)}`
}

export default function SharedMedicalRecordsDialog({
  member,
  open,
  onOpenChange,
}: SharedMedicalRecordsDialogProps) {
  const enabled =
    open && Boolean(member?.hasSharedRecordsWithMe && member.userId)
  const patientUserId = member?.userId ?? ""

  const medicationsQuery = useFetch<MedicationsListResponse>({
    path: withPatient(MEDICATIONS_API.list, patientUserId),
    queryKey: [...MEDICATIONS_QUERY_KEYS.list, "shared-modal", patientUserId],
    enabled,
  })
  const allergiesQuery = useFetch<AllergiesListResponse>({
    path: withPatient(ALLERGIES_API.list, patientUserId),
    queryKey: [...ALLERGIES_QUERY_KEYS.list, "shared-modal", patientUserId],
    enabled,
  })
  const healthHistoryQuery = useFetch<HealthHistoryListResponse>({
    path: withPatient(HEALTH_HISTORY_API.list, patientUserId),
    queryKey: [
      ...HEALTH_HISTORY_QUERY_KEYS.list,
      "shared-modal",
      patientUserId,
    ],
    enabled,
  })
  const vaccinationsQuery = useFetch<VaccinationsListResponse>({
    path: withPatient(VACCINATIONS_API.list, patientUserId),
    queryKey: [...VACCINATIONS_QUERY_KEYS.list, "shared-modal", patientUserId],
    enabled,
  })
  const labQuery = useFetch<LabResultsListResponse>({
    path: withPatient(LAB_RESULTS_API.list, patientUserId),
    queryKey: [...LAB_RESULTS_QUERY_KEYS.list, "shared-modal", patientUserId],
    enabled,
  })
  const imagingQuery = useFetch<ImagingResultsListResponse>({
    path: withPatient(IMAGING_RESULTS_API.list, patientUserId),
    queryKey: [
      ...IMAGING_RESULTS_QUERY_KEYS.list,
      "shared-modal",
      patientUserId,
    ],
    enabled,
  })

  const isLoading =
    enabled &&
    (medicationsQuery.isLoading ||
      allergiesQuery.isLoading ||
      healthHistoryQuery.isLoading ||
      vaccinationsQuery.isLoading ||
      labQuery.isLoading ||
      imagingQuery.isLoading)

  if (!member) return null

  const displayName =
    `${member.firstName} ${member.lastName}`.trim() || member.email

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
          <DialogTitle className="text-xl">{displayName}</DialogTitle>
          <DialogDescription className="mt-1">
            {member.relationship}
            {member.hasSharedRecordsWithMe
              ? " · Shared medical records"
              : " · Medical records not shared with you"}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
          <div className="grid gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-2">
            <div>
              <Typography variant="muted" className="text-xs">
                Name
              </Typography>
              <Typography variant="small" className="mt-0.5 font-medium">
                {displayName}
              </Typography>
            </div>
            <div>
              <Typography variant="muted" className="text-xs">
                Relationship
              </Typography>
              <Typography variant="small" className="mt-0.5 font-medium">
                {member.relationship}
              </Typography>
            </div>
            <div className="sm:col-span-2">
              <Typography variant="muted" className="text-xs">
                Email
              </Typography>
              <Typography variant="small" className="mt-0.5 font-medium">
                {member.email}
              </Typography>
            </div>
          </div>

          <div>
            <Typography as="h3" variant="h5" className="mb-3">
              Medical vault
            </Typography>
            {!member.hasSharedRecordsWithMe ? (
              <EmptyCard
                icon={Lock}
                title="No shared records"
                description={`${displayName} has not shared their medical records with you yet.`}
                className="bg-muted/20"
              />
            ) : isLoading ? (
              <Loader variant="fetch" label="Loading shared records..." />
            ) : (
              <div className="space-y-5">
                <RecordSection
                  icon={Activity}
                  title="Medications"
                  empty="No medications."
                  items={(medicationsQuery.data?.medications ?? []).map(
                    (item) =>
                      `${item.medicineName} · ${item.dosage}${item.condition ? ` · ${item.condition}` : ""}`
                  )}
                />
                <RecordSection
                  icon={AlertTriangle}
                  title="Allergies"
                  empty="No allergies."
                  items={(allergiesQuery.data?.allergies ?? []).map(
                    (item) => `${item.allergyType} · ${item.nature}`
                  )}
                />
                <RecordSection
                  icon={History}
                  title="Health History"
                  empty="No health history."
                  items={(healthHistoryQuery.data?.entries ?? []).map(
                    (item) => `${item.illnessName} · ${item.diagnosisDate}`
                  )}
                />
                <RecordSection
                  icon={Syringe}
                  title="Immunizations"
                  empty="No immunizations."
                  items={(vaccinationsQuery.data?.vaccinations ?? []).map(
                    (item) => `${item.vaccineName} · ${item.date}`
                  )}
                />
                <RecordSection
                  icon={FlaskConical}
                  title="Laboratory"
                  empty="No lab results."
                  items={(labQuery.data?.labResults ?? []).map(
                    (item) => `${item.testType} · ${item.testDate}`
                  )}
                />
                <RecordSection
                  icon={ScanLine}
                  title="Imaging"
                  empty="No imaging results."
                  items={(imagingQuery.data?.imagingResults ?? []).map(
                    (item) => `${item.scanType} · ${item.scanDate}`
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function RecordSection({
  icon: Icon,
  title,
  empty,
  items,
}: {
  icon: typeof Activity
  title: string
  empty: string
  items: string[]
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden />
        </span>
        <Typography variant="small" className="font-medium">
          {title}
        </Typography>
        <Badge variant="secondary" className="rounded-full">
          {items.length}
        </Badge>
      </div>
      {items.length === 0 ? (
        <Typography variant="muted" className="text-sm">
          {empty}
        </Typography>
      ) : (
        <ul className="space-y-1.5 pl-10">
          {items.map((item) => (
            <li key={item}>
              <Typography variant="muted" className="text-sm">
                {item}
              </Typography>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
