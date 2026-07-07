"use client"

import {
  Activity,
  AlertTriangle,
  Eye,
  FileText,
  FlaskConical,
  History,
  ScanLine,
  Stethoscope,
  Syringe,
  Users,
} from "lucide-react"
import { type ComponentType, type ReactNode, useState } from "react"

import { getProviderInitials } from "@/app/(dashboards)/patient/_lib/providers"
import FilePreviewDialog from "@/components/file-preview-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import type { PublicEmergencyRecords } from "@/lib/api/emergency-access"
import { isPdfMimeType } from "@/lib/file-preview"
import { cn } from "@/lib/utils"

type EmergencyRecordsViewProps = {
  records: PublicEmergencyRecords
  showHeader?: boolean
}

function formatDate(value: unknown) {
  if (typeof value !== "string" || !value) {
    return "—"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getProfileValue(profile: Record<string, unknown>, key: string) {
  const value = profile[key]
  return typeof value === "string" && value.trim() ? value : null
}

function getDisplayName(records: PublicEmergencyRecords) {
  const firstName = getProfileValue(records.profile, "firstName")
  const lastName = getProfileValue(records.profile, "lastName")

  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(" ")
  }

  return records.patientName
}

export default function EmergencyRecordsView({
  records,
  showHeader = true,
}: EmergencyRecordsViewProps) {
  const displayName = getDisplayName(records)
  const initials = getProviderInitials(displayName)
  const profileImage = getProfileValue(records.profile, "profileImage")

  return (
    <div className="space-y-6">
      {showHeader ? (
        <section className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3">
          <Typography
            variant="small"
            className="font-semibold text-destructive"
          >
            Emergency Medical Access
          </Typography>
          <Typography variant="muted" className="mt-1 text-sm">
            This information was shared for emergency care. Last updated{" "}
            {formatDate(records.exportedAt)}.
          </Typography>
        </section>
      ) : null}

      <section className="flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/30 p-4">
        <Avatar className="size-16 border-2 border-background shadow-sm">
          {profileImage ? (
            <AvatarImage src={profileImage} alt={displayName} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <Typography variant="h4">{displayName}</Typography>
          <div className="mt-2 flex flex-wrap gap-2">
            {getProfileValue(records.profile, "bloodGroup") ? (
              <Badge variant="outline" className="rounded-full">
                Blood: {getProfileValue(records.profile, "bloodGroup")}
              </Badge>
            ) : null}
            {getProfileValue(records.profile, "dateOfBirth") ? (
              <Badge variant="outline" className="rounded-full">
                DOB: {getProfileValue(records.profile, "dateOfBirth")}
              </Badge>
            ) : null}
            {getProfileValue(records.profile, "gender") ? (
              <Badge variant="outline" className="rounded-full">
                {getProfileValue(records.profile, "gender")}
              </Badge>
            ) : null}
          </div>
          <Typography variant="muted" className="mt-2 text-sm">
            {[
              getProfileValue(records.profile, "phone"),
              getProfileValue(records.profile, "email"),
            ]
              .filter(Boolean)
              .join(" · ")}
          </Typography>
          {getProfileValue(records.profile, "address") ? (
            <Typography variant="muted" className="mt-1 text-sm">
              {getProfileValue(records.profile, "address")}
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
        {records.allergies.map((allergy) => {
          const allergyType = String(allergy.allergyType ?? "Allergy")
          const nature = String(allergy.nature ?? "")
          const symptoms = Array.isArray(allergy.symptoms)
            ? allergy.symptoms.map(String)
            : []
          const triggers = Array.isArray(allergy.triggers)
            ? allergy.triggers.map(String)
            : []

          return (
            <RecordItem
              key={String(allergy.id)}
              title={`${allergyType} allergy`}
              badge={nature || undefined}
              badgeVariant={
                nature === "Severe" || nature === "Very Severe"
                  ? "destructive"
                  : "secondary"
              }
              description={symptoms.join(", ") || undefined}
              meta={
                triggers.length > 0
                  ? `Triggers: ${triggers.join(", ")}`
                  : undefined
              }
            />
          )
        })}
      </RecordSection>

      <RecordSection
        icon={Activity}
        title="Medications"
        emptyText="No medications recorded."
      >
        {records.medications.map((med) => (
          <RecordItem
            key={String(med.id)}
            title={String(med.medicineName ?? "Medication")}
            badge={String(med.dosage ?? "") || undefined}
            description={`${String(med.condition ?? "—")} · Prescribed by ${String(med.prescribedBy ?? "—")}`}
            meta={`Started ${formatDate(med.startDate)}${med.endDate ? ` · Ends ${formatDate(med.endDate)}` : ""}`}
          />
        ))}
      </RecordSection>

      <RecordSection
        icon={History}
        title="Health History"
        emptyText="No health history recorded."
      >
        {records.healthHistory.map((entry) => (
          <RecordItem
            key={String(entry.id)}
            title={String(entry.illnessName ?? "Condition")}
            description={String(entry.details ?? "") || undefined}
            meta={`Diagnosed ${formatDate(entry.diagnosisDate)} · ${String(entry.prescribedBy ?? "—")}`}
          />
        ))}
      </RecordSection>

      <RecordSection
        icon={Syringe}
        title="Immunizations"
        emptyText="No vaccinations recorded."
      >
        {records.vaccinations.map((vax) => (
          <RecordItem
            key={String(vax.id)}
            title={String(vax.vaccineName ?? "Vaccination")}
            badge={String(vax.dosage ?? "") || undefined}
            description={`Administered by ${String(vax.administeredBy ?? "—")}`}
            meta={`${formatDate(vax.vaccinationDate)} at ${String(vax.time ?? "—")}`}
          />
        ))}
      </RecordSection>

      <RecordSection
        icon={FlaskConical}
        title="Laboratory Results"
        emptyText="No lab results recorded."
      >
        {records.labResults.map((result) => (
          <FileRecordItem
            key={String(result.id)}
            title={String(result.fileName ?? "Lab result")}
            description={`${String(result.testType ?? "Lab test")} · ${formatDate(result.testDate)}`}
            fileUrl={String(result.fileUrl ?? "")}
            fileMimeType={String(result.fileMimeType ?? "")}
          />
        ))}
      </RecordSection>

      <RecordSection
        icon={ScanLine}
        title="Imaging Results"
        emptyText="No imaging results recorded."
      >
        {records.imagingResults.map((result) => (
          <FileRecordItem
            key={String(result.id)}
            title={String(result.fileName ?? "Imaging result")}
            description={`${String(result.testType ?? "Imaging")} · ${String(result.scanType ?? "—")} · ${formatDate(result.scanDate)}`}
            fileUrl={String(result.fileUrl ?? "")}
            fileMimeType={String(result.fileMimeType ?? "")}
          />
        ))}
      </RecordSection>

      <RecordSection
        icon={Stethoscope}
        title="Care Providers"
        emptyText="No care providers recorded."
      >
        {records.careProviders.map((provider) => (
          <RecordItem
            key={String(provider.id)}
            title={String(provider.name ?? "Provider")}
            description={String(provider.clinicDetails ?? "") || "—"}
            meta={[provider.phone, provider.email]
              .filter((value) => typeof value === "string" && value)
              .join(" · ")}
          />
        ))}
      </RecordSection>

      <RecordSection
        icon={Users}
        title="Family & Emergency Contacts"
        emptyText="No family members recorded."
      >
        {records.familyMembers.map((member) => {
          const memberInfo =
            member.member && typeof member.member === "object"
              ? (member.member as Record<string, unknown>)
              : null

          const memberName = memberInfo
            ? [memberInfo.firstName, memberInfo.lastName]
                .filter((value) => typeof value === "string" && value)
                .join(" ")
            : "Family member"

          return (
            <RecordItem
              key={String(member.id)}
              title={memberName}
              badge={
                member.isEmergencyContact ? "Emergency Contact" : undefined
              }
              badgeVariant={
                member.isEmergencyContact ? "destructive" : "secondary"
              }
              description={String(member.relationship ?? "") || undefined}
              meta={
                memberInfo
                  ? [memberInfo.phone, memberInfo.email]
                      .filter((value) => typeof value === "string" && value)
                      .join(" · ")
                  : undefined
              }
            />
          )
        })}
      </RecordSection>
    </div>
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

function FileRecordItem({
  title,
  description,
  fileUrl,
  fileMimeType,
}: {
  title: string
  description: string
  fileUrl: string
  fileMimeType: string
}) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const isPdf = isPdfMimeType(fileMimeType, title)

  return (
    <>
      <div className="rounded-xl border border-border/50 bg-background px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <FileText className="size-4 shrink-0 text-primary" aria-hidden />
              <Typography variant="small" className="font-semibold">
                {title}
              </Typography>
            </div>
            <Typography variant="muted" className="mt-1 text-sm">
              {description}
            </Typography>
          </div>
          {fileUrl ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="size-3.5" aria-hidden />
              {isPdf ? "View PDF" : "View File"}
            </Button>
          ) : null}
        </div>
      </div>

      <FilePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        fileName={title}
        fileMimeType={fileMimeType}
        fileSource={fileUrl || null}
      />
    </>
  )
}
