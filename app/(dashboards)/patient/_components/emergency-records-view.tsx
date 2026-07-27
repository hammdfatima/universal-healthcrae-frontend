"use client"

import {
  Activity,
  AlertTriangle,
  Eye,
  FileText,
  FlaskConical,
  History,
  Mail,
  Phone,
  Pill,
  ScanLine,
  Stethoscope,
  Syringe,
  UserRound,
  Users,
} from "lucide-react"
import Image from "next/image"
import { type ComponentType, type ReactNode, useState } from "react"

import {
  FAMILY_CONDITION_LABELS,
  formatFamilyConditionSummary,
  formatSubstanceSummary,
  isSubstanceEntryFilled,
  parseFamilyLifestyleHistoryFromExport,
  SUBSTANCE_LABELS,
} from "@/app/(dashboards)/patient/_lib/family-lifestyle-history"
import { getProviderInitials } from "@/app/(dashboards)/patient/_lib/providers"
import FilePreviewDialog from "@/components/file-preview-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import type { PublicEmergencyRecords } from "@/lib/api/emergency-access"
import { getSharpImageUrl, isPdfMimeType } from "@/lib/file-preview"
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

function Section({
  title,
  description,
  icon: Icon,
  accent,
  children,
}: {
  title: string
  description?: string
  icon: ComponentType<{ className?: string }>
  accent?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start gap-3 border-b border-border/50 pb-4">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
            accent
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        <div>
          <Typography as="h2" variant="h5">
            {title}
          </Typography>
          {description ? (
            <Typography variant="muted" className="mt-1 text-sm">
              {description}
            </Typography>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  value,
  className,
}: {
  label: string
  value: string | null | undefined
  className?: string
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1.5 text-base font-medium break-words text-foreground">
        {value?.trim() || "—"}
      </p>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <Typography variant="muted" className="text-sm">
      {text}
    </Typography>
  )
}

export default function EmergencyRecordsView({
  records,
  showHeader = true,
}: EmergencyRecordsViewProps) {
  const displayName = getDisplayName(records)
  const initials = getProviderInitials(displayName)
  const profileImage = getProfileValue(records.profile, "profileImage")
  const phone = getProfileValue(records.profile, "phone")
  const email = getProfileValue(records.profile, "email")
  const bloodGroup = getProfileValue(records.profile, "bloodGroup")
  const gender = getProfileValue(records.profile, "gender")
  const address = getProfileValue(records.profile, "address")
  const familyLifestyleHistory = parseFamilyLifestyleHistoryFromExport(
    records.familyLifestyleHistory
  )
  const pharmacies = Array.isArray(records.pharmacies) ? records.pharmacies : []
  const substanceEntries = familyLifestyleHistory.substances.filter(
    isSubstanceEntryFilled
  )
  const familyHistoryEntries = familyLifestyleHistory.familyHistory.filter(
    (entry) => formatFamilyConditionSummary(entry) !== "—"
  )

  return (
    <div className="space-y-6 pb-6 sm:pb-0">
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

      <section className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
        <div className="grid gap-0 md:grid-cols-[320px_1fr]">
          <div className="relative aspect-square bg-muted md:aspect-auto md:min-h-[320px]">
            {profileImage ? (
              <Image
                src={getSharpImageUrl(profileImage, {
                  width: 960,
                  height: 960,
                })}
                alt={`${displayName} photo`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 320px"
                quality={95}
                className="object-cover object-top"
              />
            ) : (
              <div className="flex size-full min-h-[240px] flex-col items-center justify-center gap-3 bg-primary/5 text-primary">
                <span className="text-5xl font-semibold tracking-wide">
                  {initials}
                </span>
                <Typography variant="muted" className="text-sm">
                  No profile photo available
                </Typography>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
            <Badge className="w-fit rounded-full bg-destructive/10 text-destructive hover:bg-destructive/10">
              Patient Emergency Profile
            </Badge>
            <div>
              <Typography as="h1" variant="h2">
                {displayName}
              </Typography>
              <Typography variant="muted" className="mt-2 text-base">
                {[bloodGroup ? `Blood type ${bloodGroup}` : null, gender]
                  .filter(Boolean)
                  .join(" · ") || "Emergency medical records"}
              </Typography>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Blood Group" value={bloodGroup} />
              <Field label="Gender" value={gender} />
              <Field label="Phone" value={phone} />
              <Field label="Email" value={email} />
            </div>
            {(phone || email) && (
              <div className="flex flex-wrap gap-2">
                {phone ? (
                  <Button type="button" variant="outline" size="sm" asChild>
                    <a href={`tel:${phone}`}>
                      <Phone className="size-4" aria-hidden />
                      Call Patient
                    </a>
                  </Button>
                ) : null}
                {email ? (
                  <Button type="button" variant="outline" size="sm" asChild>
                    <a href={`mailto:${email}`}>
                      <Mail className="size-4" aria-hidden />
                      Email Patient
                    </a>
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </section>

      <Section
        title="Patient Identification"
        description="Core identity and contact details."
        icon={UserRound}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name" value={displayName} />
          <Field label="Blood Group" value={bloodGroup} />
          <Field label="Gender" value={gender} />
          <Field label="Phone Number" value={phone} />
          <Field label="Email Address" value={email} />
          <Field
            label="Home Address"
            value={address}
            className="sm:col-span-2"
          />
        </div>
      </Section>

      <Section
        title="Known Allergies"
        description="Allergy type, severity, symptoms, and triggers."
        icon={AlertTriangle}
        accent="bg-destructive/10 text-destructive"
      >
        {records.allergies.length === 0 ? (
          <EmptyState text="No allergies recorded." />
        ) : (
          <div className="space-y-3">
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
                  fields={[
                    { label: "Allergy Type", value: `${allergyType} allergy` },
                    { label: "Severity", value: nature || null },
                    {
                      label: "Symptoms",
                      value: symptoms.join(", ") || null,
                    },
                    {
                      label: "Triggers",
                      value: triggers.join(", ") || null,
                    },
                  ]}
                  badge={nature || undefined}
                  badgeVariant={
                    nature === "Severe" || nature === "Very Severe"
                      ? "destructive"
                      : "secondary"
                  }
                />
              )
            })}
          </div>
        )}
      </Section>

      <Section
        title="Current Medications"
        description="Medicine name, dosage, condition, and prescribing details."
        icon={Activity}
      >
        {records.medications.length === 0 ? (
          <EmptyState text="No medications recorded." />
        ) : (
          <div className="space-y-3">
            {records.medications.map((med) => (
              <RecordItem
                key={String(med.id)}
                fields={[
                  {
                    label: "Medicine Name",
                    value: String(med.medicineName ?? "Medication"),
                  },
                  { label: "Dosage", value: String(med.dosage ?? "") || null },
                  {
                    label: "Condition",
                    value: String(med.condition ?? "") || null,
                  },
                  {
                    label: "Prescribed By",
                    value: String(med.prescribedBy ?? "") || null,
                  },
                  {
                    label: "Start Date",
                    value: formatDate(med.startDate),
                  },
                  {
                    label: "End Date",
                    value: med.endDate ? formatDate(med.endDate) : null,
                  },
                ]}
              />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Health History"
        description="Past illnesses and diagnosis details."
        icon={History}
      >
        {records.healthHistory.length === 0 ? (
          <EmptyState text="No health history recorded." />
        ) : (
          <div className="space-y-3">
            {records.healthHistory.map((entry) => (
              <RecordItem
                key={String(entry.id)}
                fields={[
                  {
                    label: "Illness / Condition",
                    value: String(entry.illnessName ?? "Condition"),
                  },
                  {
                    label: "Details",
                    value: String(entry.details ?? "") || null,
                  },
                  {
                    label: "Diagnosis Date",
                    value: formatDate(entry.diagnosisDate),
                  },
                  {
                    label: "Prescribed By",
                    value: String(entry.prescribedBy ?? "") || null,
                  },
                ]}
              />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Immunizations"
        description="Vaccine name, dosage, and administration details."
        icon={Syringe}
      >
        {records.vaccinations.length === 0 ? (
          <EmptyState text="No vaccinations recorded." />
        ) : (
          <div className="space-y-3">
            {records.vaccinations.map((vax) => (
              <RecordItem
                key={String(vax.id)}
                fields={[
                  {
                    label: "Vaccine Name",
                    value: String(vax.vaccineName ?? "Vaccination"),
                  },
                  { label: "Dosage", value: String(vax.dosage ?? "") || null },
                  {
                    label: "Administered By",
                    value: String(vax.administeredBy ?? "") || null,
                  },
                  {
                    label: "Vaccination Date",
                    value: formatDate(vax.vaccinationDate),
                  },
                  { label: "Time", value: String(vax.time ?? "") || null },
                ]}
              />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Laboratory Results"
        description="Lab tests and attached result files."
        icon={FlaskConical}
      >
        {records.labResults.length === 0 ? (
          <EmptyState text="No lab results recorded." />
        ) : (
          <div className="space-y-3">
            {records.labResults.map((result) => (
              <FileRecordItem
                key={String(result.id)}
                title={String(result.fileName ?? "Lab result")}
                fields={[
                  {
                    label: "Test Type",
                    value: String(result.testType ?? "Lab test"),
                  },
                  {
                    label: "Test Date",
                    value: formatDate(result.testDate),
                  },
                  {
                    label: "File Name",
                    value: String(result.fileName ?? "") || null,
                  },
                ]}
                fileUrl={String(result.fileUrl ?? "")}
                fileMimeType={String(result.fileMimeType ?? "")}
              />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Imaging Results"
        description="Scans and imaging reports."
        icon={ScanLine}
      >
        {records.imagingResults.length === 0 ? (
          <EmptyState text="No imaging results recorded." />
        ) : (
          <div className="space-y-3">
            {records.imagingResults.map((result) => (
              <FileRecordItem
                key={String(result.id)}
                title={String(result.fileName ?? "Imaging result")}
                fields={[
                  {
                    label: "Test Type",
                    value: String(result.testType ?? "Imaging"),
                  },
                  {
                    label: "Scan Type",
                    value: String(result.scanType ?? "") || null,
                  },
                  {
                    label: "Scan Date",
                    value: formatDate(result.scanDate),
                  },
                  {
                    label: "File Name",
                    value: String(result.fileName ?? "") || null,
                  },
                ]}
                fileUrl={String(result.fileUrl ?? "")}
                fileMimeType={String(result.fileMimeType ?? "")}
              />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Care Providers"
        description="Doctors and clinics involved in care."
        icon={Stethoscope}
      >
        {records.careProviders.length === 0 ? (
          <EmptyState text="No care providers recorded." />
        ) : (
          <div className="space-y-3">
            {records.careProviders.map((provider) => (
              <RecordItem
                key={String(provider.id)}
                fields={[
                  {
                    label: "Provider Name",
                    value: String(provider.name ?? "Provider"),
                  },
                  {
                    label: "Clinic Details",
                    value: String(provider.clinicDetails ?? "") || null,
                  },
                  {
                    label: "Phone",
                    value:
                      typeof provider.phone === "string"
                        ? provider.phone
                        : null,
                  },
                  {
                    label: "Email",
                    value:
                      typeof provider.email === "string"
                        ? provider.email
                        : null,
                  },
                ]}
              />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Preferred Pharmacies"
        description="Pharmacies used for prescriptions."
        icon={Pill}
      >
        {pharmacies.length === 0 ? (
          <EmptyState text="No preferred pharmacies recorded." />
        ) : (
          <div className="space-y-3">
            {pharmacies.map((pharmacy) => (
              <RecordItem
                key={String(pharmacy.id)}
                fields={[
                  {
                    label: "Pharmacy Name",
                    value: String(pharmacy.name ?? "Pharmacy"),
                  },
                  {
                    label: "Address",
                    value: String(pharmacy.address ?? "") || null,
                  },
                  {
                    label: "Phone",
                    value:
                      typeof pharmacy.phone === "string"
                        ? pharmacy.phone
                        : null,
                  },
                  {
                    label: "Notes",
                    value:
                      typeof pharmacy.notes === "string"
                        ? pharmacy.notes
                        : null,
                  },
                ]}
              />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Substance Use"
        description="Recorded substance use history."
        icon={Users}
      >
        {substanceEntries.length === 0 ? (
          <EmptyState text="No substance use recorded." />
        ) : (
          <div className="space-y-3">
            {substanceEntries.map((entry) => (
              <RecordItem
                key={entry.id}
                fields={[
                  {
                    label: "Substance",
                    value: SUBSTANCE_LABELS[entry.id],
                  },
                  {
                    label: "Summary",
                    value: formatSubstanceSummary(entry),
                  },
                ]}
              />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Family History"
        description="Hereditary and family medical conditions."
        icon={Users}
      >
        {familyHistoryEntries.length === 0 ? (
          <EmptyState text="No family history recorded." />
        ) : (
          <div className="space-y-3">
            {familyHistoryEntries.map((entry) => (
              <RecordItem
                key={entry.id}
                fields={[
                  {
                    label: "Condition",
                    value: FAMILY_CONDITION_LABELS[entry.id],
                  },
                  {
                    label: "Details",
                    value: formatFamilyConditionSummary(entry),
                  },
                ]}
              />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Family & Emergency Contacts"
        description="Family members and emergency contacts."
        icon={Users}
      >
        {records.familyMembers.length === 0 ? (
          <EmptyState text="No family members recorded." />
        ) : (
          <div className="space-y-3">
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

              const memberPhone =
                memberInfo && typeof memberInfo.phone === "string"
                  ? memberInfo.phone
                  : null
              const memberEmail =
                memberInfo && typeof memberInfo.email === "string"
                  ? memberInfo.email
                  : null

              return (
                <RecordItem
                  key={String(member.id)}
                  badge={
                    member.isEmergencyContact ? "Emergency Contact" : undefined
                  }
                  badgeVariant={
                    member.isEmergencyContact ? "destructive" : "secondary"
                  }
                  fields={[
                    { label: "Contact Name", value: memberName },
                    {
                      label: "Relationship",
                      value: String(member.relationship ?? "") || null,
                    },
                    { label: "Phone", value: memberPhone },
                    { label: "Email", value: memberEmail },
                  ]}
                />
              )
            })}
          </div>
        )}
      </Section>
    </div>
  )
}

function RecordItem({
  fields,
  badge,
  badgeVariant = "secondary",
}: {
  fields: Array<{ label: string; value: string | null | undefined }>
  badge?: string
  badgeVariant?: "secondary" | "destructive"
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-4">
      {badge ? (
        <div className="mb-3">
          <Badge
            variant={badgeVariant}
            className="rounded-full text-xs font-normal"
          >
            {badge}
          </Badge>
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <Field
            key={`${field.label}-${field.value ?? ""}`}
            label={field.label}
            value={field.value}
          />
        ))}
      </div>
    </div>
  )
}

function FileRecordItem({
  title,
  fields,
  fileUrl,
  fileMimeType,
}: {
  title: string
  fields: Array<{ label: string; value: string | null | undefined }>
  fileUrl: string
  fileMimeType: string
}) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const isPdf = isPdfMimeType(fileMimeType, title)

  return (
    <>
      <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-4">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-2">
            <FileText
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden
            />
            <Typography
              variant="small"
              className="min-w-0 break-all font-semibold sm:truncate"
              title={title}
            >
              {title}
            </Typography>
          </div>
          {fileUrl ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full shrink-0 gap-1.5 sm:w-auto"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="size-3.5" aria-hidden />
              {isPdf ? "View PDF" : "View File"}
            </Button>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <Field
              key={`${field.label}-${field.value ?? ""}`}
              label={field.label}
              value={field.value}
            />
          ))}
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
