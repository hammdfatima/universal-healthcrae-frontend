"use client"

import {
  Activity,
  AlertTriangle,
  FlaskConical,
  History,
  Lock,
  PawPrint,
  ScanLine,
  Syringe,
} from "lucide-react"
import { useState } from "react"

import { getImagingResultFileSource } from "@/app/(dashboards)/patient/_lib/imaging"
import { getLabResultFileSource } from "@/app/(dashboards)/patient/_lib/lab"
import PetDetailsDialog from "@/app/(dashboards)/patient/family-members/_components/pet-details-dialog"
import EmptyCard from "@/components/empty-card"
import FilePreviewCard from "@/components/file-preview-card"
import FilePreviewDialog from "@/components/file-preview-dialog"
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
  type ImagingResult,
  type ImagingResultsListResponse,
} from "@/lib/api/imaging-results"
import {
  LAB_RESULTS_API,
  LAB_RESULTS_QUERY_KEYS,
  type LabResult,
  type LabResultsListResponse,
} from "@/lib/api/lab-results"
import type { SidebarFamilyMember } from "@/lib/api/medical-record-shares"
import {
  MEDICATIONS_API,
  MEDICATIONS_QUERY_KEYS,
  type MedicationsListResponse,
} from "@/lib/api/medications"
import {
  PETS_API,
  PETS_QUERY_KEYS,
  type Pet,
  type SharedPetsResponse,
} from "@/lib/api/pets"
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

type PreviewFile = {
  fileName: string
  fileMimeType: string
  fileSource: string
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
  const medicalEnabled =
    open && Boolean(member?.hasSharedRecordsWithMe && member.userId)
  const petsEnabled = open && Boolean(member?.sharedPetCount && member.userId)
  const patientUserId = member?.userId ?? ""
  const [preview, setPreview] = useState<PreviewFile | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [petDetailsOpen, setPetDetailsOpen] = useState(false)

  const medicationsQuery = useFetch<MedicationsListResponse>({
    path: withPatient(MEDICATIONS_API.list, patientUserId),
    queryKey: [...MEDICATIONS_QUERY_KEYS.list, "shared-modal", patientUserId],
    enabled: medicalEnabled,
  })
  const allergiesQuery = useFetch<AllergiesListResponse>({
    path: withPatient(ALLERGIES_API.list, patientUserId),
    queryKey: [...ALLERGIES_QUERY_KEYS.list, "shared-modal", patientUserId],
    enabled: medicalEnabled,
  })
  const healthHistoryQuery = useFetch<HealthHistoryListResponse>({
    path: withPatient(HEALTH_HISTORY_API.list, patientUserId),
    queryKey: [
      ...HEALTH_HISTORY_QUERY_KEYS.list,
      "shared-modal",
      patientUserId,
    ],
    enabled: medicalEnabled,
  })
  const vaccinationsQuery = useFetch<VaccinationsListResponse>({
    path: withPatient(VACCINATIONS_API.list, patientUserId),
    queryKey: [...VACCINATIONS_QUERY_KEYS.list, "shared-modal", patientUserId],
    enabled: medicalEnabled,
  })
  const labQuery = useFetch<LabResultsListResponse>({
    path: withPatient(LAB_RESULTS_API.list, patientUserId),
    queryKey: [...LAB_RESULTS_QUERY_KEYS.list, "shared-modal", patientUserId],
    enabled: medicalEnabled,
  })
  const imagingQuery = useFetch<ImagingResultsListResponse>({
    path: withPatient(IMAGING_RESULTS_API.list, patientUserId),
    queryKey: [
      ...IMAGING_RESULTS_QUERY_KEYS.list,
      "shared-modal",
      patientUserId,
    ],
    enabled: medicalEnabled,
  })
  const petsQuery = useFetch<SharedPetsResponse>({
    path: PETS_API.shared(patientUserId),
    queryKey: PETS_QUERY_KEYS.shared(patientUserId),
    enabled: petsEnabled,
  })

  const isLoading =
    medicalEnabled &&
    (medicationsQuery.isLoading ||
      allergiesQuery.isLoading ||
      healthHistoryQuery.isLoading ||
      vaccinationsQuery.isLoading ||
      labQuery.isLoading ||
      imagingQuery.isLoading)

  if (!member) return null

  const displayName =
    `${member.firstName} ${member.lastName}`.trim() || member.email

  function openLabPreview(result: LabResult) {
    setPreview({
      fileName: result.fileName,
      fileMimeType: result.fileMimeType,
      fileSource: getLabResultFileSource(result),
    })
    setPreviewOpen(true)
  }

  function openImagingPreview(result: ImagingResult) {
    setPreview({
      fileName: result.fileName,
      fileMimeType: result.fileMimeType,
      fileSource: getImagingResultFileSource(result),
    })
    setPreviewOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
            <DialogTitle className="text-xl">{displayName}</DialogTitle>
            <DialogDescription className="mt-1">
              {member.relationship}
              {member.hasSharedRecordsWithMe
                ? " · Shared medical records"
                : member.sharedPetCount > 0
                  ? ` · ${member.sharedPetCount} shared pet profile${member.sharedPetCount === 1 ? "" : "s"}`
                  : " · Nothing shared with you"}
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
                  <FileRecordSection
                    icon={FlaskConical}
                    title="Laboratory"
                    empty="No lab results."
                    count={labQuery.data?.labResults?.length ?? 0}
                  >
                    {(labQuery.data?.labResults ?? []).map((item) => (
                      <div key={item.id} className="space-y-1.5">
                        <Typography variant="muted" className="text-sm">
                          {item.testType} · {item.testDate}
                        </Typography>
                        <FilePreviewCard
                          fileName={item.fileName}
                          fileMimeType={item.fileMimeType}
                          onClick={() => openLabPreview(item)}
                        />
                      </div>
                    ))}
                  </FileRecordSection>
                  <FileRecordSection
                    icon={ScanLine}
                    title="Imaging"
                    empty="No imaging results."
                    count={imagingQuery.data?.imagingResults?.length ?? 0}
                  >
                    {(imagingQuery.data?.imagingResults ?? []).map((item) => (
                      <div key={item.id} className="space-y-1.5">
                        <Typography variant="muted" className="text-sm">
                          {item.scanType} · {item.scanDate}
                        </Typography>
                        <FilePreviewCard
                          fileName={item.fileName}
                          fileMimeType={item.fileMimeType}
                          onClick={() => openImagingPreview(item)}
                        />
                      </div>
                    ))}
                  </FileRecordSection>
                </div>
              )}
            </div>

            <div>
              <Typography as="h3" variant="h5" className="mb-3">
                Shared pets
              </Typography>
              {member.sharedPetCount === 0 ? (
                <EmptyCard
                  icon={PawPrint}
                  title="No shared pet profiles"
                  description={`${displayName} has not shared any pet profiles with you.`}
                  className="bg-muted/20"
                />
              ) : petsQuery.isLoading ? (
                <Loader variant="fetch" label="Loading shared pets..." />
              ) : petsQuery.isError ? (
                <EmptyCard
                  icon={AlertTriangle}
                  title="Could not load shared pets"
                  description={
                    (petsQuery.error as Error)?.message ??
                    "Please close this dialog and try again."
                  }
                  className="bg-muted/20"
                />
              ) : (
                <div className="space-y-2">
                  {(petsQuery.data?.pets ?? []).map((pet) => (
                    <button
                      key={pet.id}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl border border-border/60 px-4 py-3 text-left transition-colors hover:bg-muted/30"
                      onClick={() => {
                        setSelectedPet(pet)
                        setPetDetailsOpen(true)
                      }}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <PawPrint className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <Typography variant="small" className="font-medium">
                          {pet.name}
                        </Typography>
                        <Typography variant="muted" className="text-xs">
                          {pet.species}
                          {pet.breed ? ` · ${pet.breed}` : ""}
                        </Typography>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <FilePreviewDialog
        open={previewOpen}
        onOpenChange={(nextOpen) => {
          setPreviewOpen(nextOpen)
          if (!nextOpen) {
            setPreview(null)
          }
        }}
        fileName={preview?.fileName ?? ""}
        fileMimeType={preview?.fileMimeType ?? ""}
        fileSource={preview?.fileSource ?? null}
      />
      <PetDetailsDialog
        pet={selectedPet}
        open={petDetailsOpen}
        onOpenChange={setPetDetailsOpen}
        readOnly
      />
    </>
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

function FileRecordSection({
  icon: Icon,
  title,
  empty,
  count,
  children,
}: {
  icon: typeof Activity
  title: string
  empty: string
  count: number
  children: React.ReactNode
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
          {count}
        </Badge>
      </div>
      {count === 0 ? (
        <Typography variant="muted" className="text-sm">
          {empty}
        </Typography>
      ) : (
        <div className="space-y-3 pl-10">{children}</div>
      )}
    </div>
  )
}
