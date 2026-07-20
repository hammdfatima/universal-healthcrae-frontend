"use client"

import {
  Activity,
  AlertTriangle,
  Download,
  History,
  Pill,
  Stethoscope,
  Syringe,
  Users,
} from "lucide-react"
import { type ComponentType, type ReactNode, useMemo } from "react"

import { downloadMedicalRecordsPdf } from "@/app/(dashboards)/patient/_lib/download-medical-records-pdf"
import {
  FAMILY_CONDITION_LABELS,
  formatFamilyConditionSummary,
  formatSubstanceSummary,
  isSubstanceEntryFilled,
  SUBSTANCE_LABELS,
} from "@/app/(dashboards)/patient/_lib/family-lifestyle-history"
import {
  getMedicalRecordsSummary,
  type MedicalRecordsSummary,
} from "@/app/(dashboards)/patient/_lib/medical-records-summary"
import { getProviderInitials } from "@/app/(dashboards)/patient/_lib/providers"
import { getProfileDisplayName } from "@/app/(dashboards)/patient/_lib/settings"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  CARE_PROVIDERS_API,
  CARE_PROVIDERS_QUERY_KEYS,
  type CareProvidersListResponse,
} from "@/lib/api/care-providers"
import {
  FAMILY_LIFESTYLE_HISTORY_API,
  FAMILY_LIFESTYLE_HISTORY_QUERY_KEYS,
  type FamilyLifestyleHistoryResponse,
} from "@/lib/api/family-lifestyle-history"
import {
  HEALTH_HISTORY_API,
  HEALTH_HISTORY_QUERY_KEYS,
  type HealthHistoryListResponse,
} from "@/lib/api/health-history"
import {
  MEDICATIONS_API,
  MEDICATIONS_QUERY_KEYS,
  type MedicationsListResponse,
} from "@/lib/api/medications"
import {
  apiProfileToPatientProfile,
  PATIENT_PROFILE_API,
  PATIENT_PROFILE_QUERY_KEYS,
  type PatientProfileResponse,
} from "@/lib/api/patient-profile"
import {
  PHARMACIES_API,
  PHARMACIES_QUERY_KEYS,
  type PharmaciesListResponse,
} from "@/lib/api/pharmacies"
import {
  VACCINATIONS_API,
  VACCINATIONS_QUERY_KEYS,
  type VaccinationsListResponse,
} from "@/lib/api/vaccinations"
import { cn } from "@/lib/utils"

type ReviewRecordsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ReviewRecordsDialog({
  open,
  onOpenChange,
}: ReviewRecordsDialogProps) {
  const profileQuery = useFetch<PatientProfileResponse>({
    path: PATIENT_PROFILE_API.get,
    queryKey: PATIENT_PROFILE_QUERY_KEYS.profile,
    enabled: open,
  })
  const careProvidersQuery = useFetch<CareProvidersListResponse>({
    path: CARE_PROVIDERS_API.list,
    queryKey: CARE_PROVIDERS_QUERY_KEYS.list,
    enabled: open,
  })
  const medicationsQuery = useFetch<MedicationsListResponse>({
    path: MEDICATIONS_API.list,
    queryKey: MEDICATIONS_QUERY_KEYS.list,
    enabled: open,
  })
  const allergiesQuery = useFetch<AllergiesListResponse>({
    path: ALLERGIES_API.list,
    queryKey: ALLERGIES_QUERY_KEYS.list,
    enabled: open,
  })
  const healthHistoryQuery = useFetch<HealthHistoryListResponse>({
    path: HEALTH_HISTORY_API.list,
    queryKey: HEALTH_HISTORY_QUERY_KEYS.list,
    enabled: open,
  })
  const vaccinationsQuery = useFetch<VaccinationsListResponse>({
    path: VACCINATIONS_API.list,
    queryKey: VACCINATIONS_QUERY_KEYS.list,
    enabled: open,
  })
  const pharmaciesQuery = useFetch<PharmaciesListResponse>({
    path: PHARMACIES_API.list,
    queryKey: PHARMACIES_QUERY_KEYS.list,
    enabled: open,
  })
  const familyLifestyleHistoryQuery = useFetch<FamilyLifestyleHistoryResponse>({
    path: FAMILY_LIFESTYLE_HISTORY_API.get,
    queryKey: FAMILY_LIFESTYLE_HISTORY_QUERY_KEYS.detail,
    enabled: open,
  })

  const isLoading =
    profileQuery.isLoading ||
    careProvidersQuery.isLoading ||
    medicationsQuery.isLoading ||
    allergiesQuery.isLoading ||
    healthHistoryQuery.isLoading ||
    vaccinationsQuery.isLoading ||
    pharmaciesQuery.isLoading ||
    familyLifestyleHistoryQuery.isLoading

  const summary = useMemo<MedicalRecordsSummary | null>(() => {
    if (!open || isLoading || !profileQuery.data) {
      return null
    }

    return getMedicalRecordsSummary(
      apiProfileToPatientProfile(profileQuery.data),
      careProvidersQuery.data?.providers ?? [],
      medicationsQuery.data?.medications ?? [],
      allergiesQuery.data?.allergies ?? [],
      healthHistoryQuery.data?.entries ?? [],
      vaccinationsQuery.data?.vaccinations ?? [],
      pharmaciesQuery.data?.pharmacies ?? [],
      familyLifestyleHistoryQuery.data?.familyLifestyleHistory
    )
  }, [
    allergiesQuery.data?.allergies,
    careProvidersQuery.data?.providers,
    familyLifestyleHistoryQuery.data?.familyLifestyleHistory,
    healthHistoryQuery.data?.entries,
    isLoading,
    medicationsQuery.data?.medications,
    open,
    pharmaciesQuery.data?.pharmacies,
    profileQuery.data,
    vaccinationsQuery.data?.vaccinations,
  ])

  const { profile } = summary ?? { profile: null }
  const displayName = profile ? getProfileDisplayName(profile) : ""
  const initials = displayName ? getProviderInitials(displayName) : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
          <DialogTitle>Medical Records Summary</DialogTitle>
          <DialogDescription>
            Critical profile details and medical vault information for emergency
            reference.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <Loader label="Loading medical records..." className="py-16" />
        ) : summary && profile ? (
          <>
            <div className="thin-scrollbar space-y-6 overflow-y-auto px-6 py-5">
              <section className="flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/30 p-4">
                <Avatar className="size-16 border-2 border-background shadow-sm">
                  {profile.profileImage ? (
                    <AvatarImage src={profile.profileImage} alt={displayName} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <Typography variant="h4">{displayName}</Typography>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.bloodGroup ? (
                      <Badge variant="outline" className="rounded-full">
                        Blood: {profile.bloodGroup}
                      </Badge>
                    ) : null}
                    {profile.gender ? (
                      <Badge variant="outline" className="rounded-full">
                        {profile.gender}
                      </Badge>
                    ) : null}
                  </div>
                  <Typography variant="muted" className="mt-2 text-sm">
                    {profile.phone} · {profile.email}
                  </Typography>
                  {profile.address ? (
                    <Typography variant="muted" className="mt-1 text-sm">
                      {profile.address}
                    </Typography>
                  ) : null}
                </div>
              </section>

              <RecordSection
                icon={AlertTriangle}
                title="Known Allergies"
                accent="text-destructive"
                emptyText="No allergies recorded."
              >
                {summary.allergies.map((allergy) => (
                  <RecordItem
                    key={allergy.id}
                    title={`${allergy.allergyType} allergy`}
                    badge={allergy.nature}
                    badgeVariant={
                      allergy.nature === "Severe" ||
                      allergy.nature === "Very Severe"
                        ? "destructive"
                        : "secondary"
                    }
                    description={allergy.symptoms.join(", ")}
                    meta={
                      allergy.triggers.length > 0
                        ? `Triggers: ${allergy.triggers.join(", ")}`
                        : undefined
                    }
                  />
                ))}
              </RecordSection>

              <RecordSection
                icon={Activity}
                title="Medications"
                emptyText="No medications recorded."
              >
                {summary.medications.map((med) => (
                  <RecordItem
                    key={med.id}
                    title={med.medicineName}
                    badge={med.dosage}
                    description={`${med.condition} · Prescribed by ${med.prescribedBy}`}
                    meta={`Started ${med.startDate}${med.endDate ? ` · Ends ${med.endDate}` : ""}`}
                  />
                ))}
              </RecordSection>

              <RecordSection
                icon={History}
                title="Health History"
                emptyText="No health history recorded."
              >
                {summary.healthHistory.map((entry) => (
                  <RecordItem
                    key={entry.id}
                    title={entry.illnessName}
                    description={entry.details}
                    meta={`Diagnosed ${entry.diagnosisDate} · ${entry.prescribedBy}`}
                  />
                ))}
              </RecordSection>

              <RecordSection
                icon={Syringe}
                title="Immunizations"
                emptyText="No vaccinations recorded."
              >
                {summary.vaccinations.map((vax) => (
                  <RecordItem
                    key={vax.id}
                    title={vax.vaccineName}
                    badge={vax.dosage}
                    description={`Administered by ${vax.administeredBy}`}
                    meta={`${vax.date} at ${vax.time}`}
                  />
                ))}
              </RecordSection>

              <RecordSection
                icon={Stethoscope}
                title="Care Providers"
                emptyText="No care providers recorded."
              >
                {summary.careProviders.map((provider) => (
                  <RecordItem
                    key={provider.id}
                    title={provider.name}
                    description={provider.clinicDetails || "—"}
                    meta={[provider.phone, provider.email]
                      .filter(Boolean)
                      .join(" · ")}
                  />
                ))}
              </RecordSection>

              <RecordSection
                icon={Pill}
                title="Preferred Pharmacies"
                emptyText="No preferred pharmacies recorded."
              >
                {summary.pharmacies.map((pharmacy) => (
                  <RecordItem
                    key={pharmacy.id}
                    title={pharmacy.name}
                    description={pharmacy.address || undefined}
                    meta={[pharmacy.phone, pharmacy.notes]
                      .filter(Boolean)
                      .join(" · ")}
                  />
                ))}
              </RecordSection>

              <RecordSection
                icon={Users}
                title="Substance Use"
                emptyText="No substance use recorded."
              >
                {summary.familyLifestyleHistory.substances
                  .filter(isSubstanceEntryFilled)
                  .map((entry) => (
                    <RecordItem
                      key={entry.id}
                      title={SUBSTANCE_LABELS[entry.id]}
                      description={formatSubstanceSummary(entry)}
                    />
                  ))}
              </RecordSection>

              <RecordSection
                icon={Users}
                title="Family History"
                emptyText="No family history recorded."
              >
                {summary.familyLifestyleHistory.familyHistory
                  .filter(
                    (entry) => formatFamilyConditionSummary(entry) !== "—"
                  )
                  .map((entry) => (
                    <RecordItem
                      key={entry.id}
                      title={FAMILY_CONDITION_LABELS[entry.id]}
                      description={formatFamilyConditionSummary(entry)}
                    />
                  ))}
              </RecordSection>
            </div>

            <DialogFooter className="border-t border-border/60 px-6 py-4 sm:justify-end">
              <Button
                type="button"
                className="gap-1.5"
                onClick={() => void downloadMedicalRecordsPdf(summary)}
              >
                <Download className="size-4" aria-hidden />
                Download PDF
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="px-6 py-12 text-center">
            <Typography variant="muted">
              Unable to load medical records. Please try again.
            </Typography>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function RecordSection({
  icon: Icon,
  title,
  accent,
  emptyText,
  children,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  accent?: string
  emptyText?: string
  children?: ReactNode
}) {
  const hasContent = Array.isArray(children)
    ? children.length > 0
    : Boolean(children)

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn("size-4 text-primary", accent)} aria-hidden />
        <Typography variant="small" className="font-semibold">
          {title}
        </Typography>
      </div>
      {hasContent ? (
        <div className="space-y-2">{children}</div>
      ) : emptyText ? (
        <Typography variant="muted" className="text-sm">
          {emptyText}
        </Typography>
      ) : null}
    </section>
  )
}

function RecordItem({
  title,
  badge,
  badgeVariant = "secondary",
  description,
  meta,
}: {
  title: string
  badge?: string
  badgeVariant?: "secondary" | "destructive"
  description?: string
  meta?: string
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-background px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <Typography variant="small" className="font-semibold">
          {title}
        </Typography>
        {badge ? (
          <Badge
            variant={badgeVariant}
            className="rounded-full text-xs font-normal"
          >
            {badge}
          </Badge>
        ) : null}
      </div>
      {description ? (
        <Typography variant="muted" className="mt-1 text-sm">
          {description}
        </Typography>
      ) : null}
      {meta ? (
        <Typography variant="muted" className="mt-1 text-xs">
          {meta}
        </Typography>
      ) : null}
    </div>
  )
}
