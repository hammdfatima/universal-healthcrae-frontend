"use client"

import {
  Activity,
  AlertTriangle,
  Download,
  FlaskConical,
  HeartPulse,
  History,
  ScanLine,
  Stethoscope,
  Syringe,
} from "lucide-react"
import { type ComponentType, type ReactNode, useEffect, useState } from "react"

import { downloadMedicalRecordsPdf } from "@/app/(dashboards)/patient/_lib/download-medical-records-pdf"
import {
  getMedicalRecordsSummary,
  type MedicalRecordsSummary,
} from "@/app/(dashboards)/patient/_lib/medical-records-summary"
import { getProviderInitials } from "@/app/(dashboards)/patient/_lib/providers"
import { getProfileDisplayName } from "@/app/(dashboards)/patient/_lib/settings"
import { formatVitalDisplay } from "@/app/(dashboards)/patient/_lib/vitals"
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
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

type ReviewRecordsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ReviewRecordsDialog({
  open,
  onOpenChange,
}: ReviewRecordsDialogProps) {
  const [summary, setSummary] = useState<MedicalRecordsSummary | null>(null)

  useEffect(() => {
    if (open) {
      setSummary(getMedicalRecordsSummary())
    }
  }, [open])

  if (!summary) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Medical Records Summary</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  const { profile } = summary
  const displayName = getProfileDisplayName(profile)
  const initials = getProviderInitials(displayName)

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
                {profile.dateOfBirth ? (
                  <Badge variant="outline" className="rounded-full">
                    DOB: {profile.dateOfBirth}
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
                  allergy.nature === "Severe" || allergy.nature === "Very Severe"
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

          <RecordSection icon={HeartPulse} title="Vital Signs">
            <div className="grid gap-3 sm:grid-cols-2">
              <VitalChip
                label="Blood Pressure"
                value={`${formatVitalDisplay(summary.vitals.bloodPressureSystolic)}/${formatVitalDisplay(summary.vitals.bloodPressureDiastolic)} mmHg`}
              />
              <VitalChip
                label="Heart Rate"
                value={formatVitalDisplay(summary.vitals.heartRate, "bpm")}
              />
              <VitalChip
                label="Temperature"
                value={formatVitalDisplay(
                  summary.vitals.temperatureCelsius,
                  "°C"
                )}
              />
              <VitalChip
                label="BMI"
                value={formatVitalDisplay(summary.vitals.bmi)}
              />
              <VitalChip
                label="Height"
                value={formatVitalDisplay(summary.vitals.heightCm, "cm")}
              />
              <VitalChip
                label="Weight"
                value={formatVitalDisplay(summary.vitals.weightKg, "kg")}
              />
              <VitalChip
                label="Cholesterol"
                value={formatVitalDisplay(
                  summary.vitals.totalCholesterol,
                  "mg/dL"
                )}
              />
              <VitalChip
                label="Respiratory Rate"
                value={formatVitalDisplay(
                  summary.vitals.respiratoryRate,
                  "/min"
                )}
              />
            </div>
            {summary.vitals.customFields
              .filter((field) => field.fieldName.trim() && field.value.trim())
              .map((field) => (
                <VitalChip
                  key={field.id}
                  label={field.fieldName}
                  value={field.value}
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
            icon={FlaskConical}
            title="Laboratory"
            emptyText="No lab results recorded."
          >
            {summary.labResults.map((lab) => (
              <RecordItem
                key={lab.id}
                title={lab.testType}
                description={lab.fileName}
                meta={lab.testDate}
              />
            ))}
          </RecordSection>

          <RecordSection
            icon={ScanLine}
            title="Imaging"
            emptyText="No imaging records."
          >
            {summary.imagingResults.map((scan) => (
              <RecordItem
                key={scan.id}
                title={scan.scanType}
                badge={scan.testType}
                description={scan.fileName}
                meta={scan.scanDate}
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
                meta={[provider.phone, provider.email].filter(Boolean).join(" · ")}
              />
            ))}
          </RecordSection>
        </div>

        <DialogFooter className="border-t border-border/60 px-6 py-4 sm:justify-between">
          <Typography variant="muted" className="text-xs">
            Last updated vitals: {summary.vitals.updatedOn}
          </Typography>
          <Button
            type="button"
            className="gap-1.5"
            onClick={() => void downloadMedicalRecordsPdf(summary)}
          >
            <Download className="size-4" aria-hidden />
            Download PDF
          </Button>
        </DialogFooter>
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

function VitalChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-background px-4 py-3">
      <Typography variant="muted" className="text-xs">
        {label}
      </Typography>
      <Typography variant="small" className="mt-1 font-semibold">
        {value}
      </Typography>
    </div>
  )
}
