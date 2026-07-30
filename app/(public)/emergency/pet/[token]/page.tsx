"use client"

import {
  AlertTriangle,
  Eye,
  EyeOff,
  FileText,
  HeartPulse,
  Mail,
  PawPrint,
  Phone,
  Pill,
  Printer,
  Share2,
  ShieldAlert,
  Stethoscope,
  Syringe,
  UserRound,
} from "lucide-react"
import Image from "next/image"
import { type ReactNode, use, useState } from "react"
import toast from "react-hot-toast"

import { getPetAgeLabel } from "@/app/(dashboards)/patient/_lib/pets"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  PET_EMERGENCY_ACCESS_API,
  PET_EMERGENCY_ACCESS_QUERY_KEYS,
  type PublicPetEmergencyChallenge,
  type PublicPetEmergencyRecords,
} from "@/lib/api/pet-emergency-access"
import { getSharpImageUrl } from "@/lib/file-preview"
import { cn } from "@/lib/utils"

type PetEmergencyAccessPageProps = {
  params: Promise<{ token: string }>
}

function Section({
  title,
  description,
  icon: Icon,
  children,
  className,
}: {
  title: string
  description?: string
  icon: typeof PawPrint
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6 print:break-inside-avoid print:border print:border-border print:p-3 print:shadow-none",
        className
      )}
    >
      <div className="mb-4 flex items-start gap-3 border-b border-border/50 pb-4 print:mb-2 print:pb-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary print:size-8">
          <Icon className="size-5 print:size-4" aria-hidden />
        </span>
        <div>
          <Typography as="h2" variant="h5" className="print:text-base">
            {title}
          </Typography>
          {description ? (
            <Typography variant="muted" className="mt-1 text-sm print:hidden">
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
      <p className="mt-1.5 text-base font-medium break-words text-foreground print:mt-0.5 print:text-sm">
        {value?.trim() || "—"}
      </p>
    </div>
  )
}

function InfoList({
  empty,
  items,
}: {
  empty: string
  items: Array<{ title: string; detail?: string }>
}) {
  if (items.length === 0) {
    return (
      <Typography variant="muted" className="text-sm">
        {empty}
      </Typography>
    )
  }

  return (
    <ul className="space-y-3 print:space-y-1.5">
      {items.map((item) => (
        <li
          key={`${item.title}-${item.detail ?? ""}`}
          className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3 print:rounded-none print:border-0 print:bg-transparent print:px-0 print:py-1"
        >
          <p className="font-medium text-foreground print:text-sm">
            {item.title}
          </p>
          {item.detail ? (
            <p className="mt-1 text-sm text-muted-foreground print:mt-0.5 print:text-xs">
              {item.detail}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

function EmergencySummaryActions({ petName }: { petName: string }) {
  async function handleShare() {
    const shareData = {
      title: `Emergency Pet Summary — ${petName}`,
      text: `Emergency medical summary for ${petName}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }

      await navigator.clipboard.writeText(window.location.href)
      toast.success("Emergency summary link copied to clipboard.")
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return
      toast.error("Unable to share this summary right now.")
    }
  }

  return (
    <div className="print:hidden sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-6">
        <div>
          <Typography variant="small" className="font-semibold">
            Emergency Pet Summary
          </Typography>
          <Typography variant="muted" className="text-xs">
            One-page medical overview for emergency veterinary care
          </Typography>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="size-4" aria-hidden />
            Share
          </Button>
          <Button type="button" size="sm" onClick={() => window.print()}>
            <Printer className="size-4" aria-hidden />
            Print
          </Button>
        </div>
      </div>
    </div>
  )
}

function PetEmergencyProfileView({
  records,
}: {
  records: PublicPetEmergencyRecords
}) {
  const ageLabel = getPetAgeLabel(records.dateOfBirth)

  return (
    <div className="print:bg-white">
      <EmergencySummaryActions petName={records.name} />

      <div className="mx-auto max-w-6xl space-y-6 px-5 pb-24 pt-8 sm:px-6 sm:pb-10 sm:pt-10 print:max-w-none print:space-y-3 print:px-0 print:pb-0 print:pt-0">
        <section className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm print:rounded-none print:border print:shadow-none">
          <div className="grid gap-0 md:grid-cols-[240px_1fr] print:grid-cols-[140px_1fr]">
            <div className="relative aspect-square bg-muted md:aspect-auto md:min-h-[240px] print:min-h-[140px] print:aspect-square">
              {records.profileImage ? (
                <Image
                  src={getSharpImageUrl(records.profileImage, {
                    width: 960,
                    height: 960,
                  })}
                  alt={`${records.name} photo`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 240px"
                  quality={95}
                  className="object-cover object-top"
                />
              ) : (
                <div className="flex size-full min-h-[180px] flex-col items-center justify-center gap-3 bg-primary/5 text-primary print:min-h-[140px]">
                  <PawPrint className="size-16 print:size-10" aria-hidden />
                  <Typography variant="muted" className="text-sm print:text-xs">
                    No pet photo available
                  </Typography>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 print:gap-2 print:p-4">
              <Badge className="w-fit rounded-full bg-destructive/10 text-destructive hover:bg-destructive/10 print:text-xs">
                Emergency Pet Summary
              </Badge>
              <div>
                <Typography as="h1" variant="h2" className="print:text-2xl">
                  {records.name}
                </Typography>
                <Typography
                  variant="muted"
                  className="mt-2 text-base print:mt-1 print:text-sm"
                >
                  {[records.species, records.breed, ageLabel]
                    .filter(Boolean)
                    .join(" · ")}
                </Typography>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 print:gap-2">
                <Field label="Sex" value={records.sex} />
                <Field label="Weight" value={records.weight} />
                <Field label="Date of Birth" value={records.dateOfBirth} />
                <Field label="Microchip Number" value={records.microchipId} />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2 print:grid-cols-2 print:gap-3">
          <Section
            title="Owner Contact"
            description="Primary owner to call in an emergency."
            icon={UserRound}
          >
            <div className="grid gap-5 sm:grid-cols-2 print:gap-2">
              <Field label="Owner Name" value={records.ownerName} />
              <Field label="Owner Phone" value={records.ownerPhone} />
              <Field
                label="Owner Email"
                value={records.ownerEmail}
                className="sm:col-span-2"
              />
            </div>
            {(records.ownerPhone || records.ownerEmail) && (
              <div className="mt-4 flex flex-wrap gap-2 print:hidden">
                {records.ownerPhone ? (
                  <Button type="button" variant="outline" size="sm" asChild>
                    <a href={`tel:${records.ownerPhone}`}>
                      <Phone className="size-4" aria-hidden />
                      Call Owner
                    </a>
                  </Button>
                ) : null}
                {records.ownerEmail ? (
                  <Button type="button" variant="outline" size="sm" asChild>
                    <a href={`mailto:${records.ownerEmail}`}>
                      <Mail className="size-4" aria-hidden />
                      Email Owner
                    </a>
                  </Button>
                ) : null}
              </div>
            )}
          </Section>

          <Section
            title="Emergency Contact"
            description="Additional person to contact for this pet."
            icon={ShieldAlert}
          >
            {records.emergencyContact ? (
              <div className="grid gap-5 sm:grid-cols-2 print:gap-2">
                <Field
                  label="Contact Name"
                  value={`${records.emergencyContact.firstName} ${records.emergencyContact.lastName}`.trim()}
                />
                <Field
                  label="Relationship"
                  value={records.emergencyContact.relationship}
                />
                <Field
                  label="Phone Number"
                  value={records.emergencyContact.phone}
                  className="sm:col-span-2"
                />
                {records.emergencyContact.phone ? (
                  <div className="sm:col-span-2 print:hidden">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <a href={`tel:${records.emergencyContact.phone}`}>
                        <Phone className="size-4" aria-hidden />
                        Call Emergency Contact
                      </a>
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Typography variant="muted" className="text-sm">
                No emergency contact assigned.
              </Typography>
            )}
          </Section>

          <Section
            title="Primary Veterinarian"
            description="Clinic and phone number for veterinary care."
            icon={Stethoscope}
          >
            <div className="grid gap-5 sm:grid-cols-2 print:gap-2">
              <Field
                label="Veterinary Clinic"
                value={records.veterinaryClinic}
              />
              <Field label="Veterinary Phone" value={records.veterinaryPhone} />
            </div>
            {records.veterinaryPhone ? (
              <div className="mt-4 print:hidden">
                <Button type="button" variant="outline" size="sm" asChild>
                  <a href={`tel:${records.veterinaryPhone}`}>
                    <Phone className="size-4" aria-hidden />
                    Call Veterinarian
                  </a>
                </Button>
              </div>
            ) : null}
          </Section>

          <Section
            title="Emergency Veterinary Clinic"
            description="After-hours emergency clinic details."
            icon={AlertTriangle}
          >
            <div className="grid gap-5 sm:grid-cols-2 print:gap-2">
              <Field
                label="Emergency Clinic"
                value={records.emergencyVeterinaryClinic}
              />
              <Field
                label="Emergency Clinic Phone"
                value={records.emergencyVeterinaryPhone}
              />
            </div>
            {records.emergencyVeterinaryPhone ? (
              <div className="mt-4 print:hidden">
                <Button type="button" variant="outline" size="sm" asChild>
                  <a href={`tel:${records.emergencyVeterinaryPhone}`}>
                    <Phone className="size-4" aria-hidden />
                    Call Emergency Clinic
                  </a>
                </Button>
              </div>
            ) : null}
          </Section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 print:grid-cols-2 print:gap-3">
          <Section
            title="Medical Conditions"
            description="Known health conditions for this pet."
            icon={HeartPulse}
          >
            <InfoList
              empty="No medical conditions recorded."
              items={records.medicalConditions.map((item) => ({
                title: item.name,
                detail: item.notes,
              }))}
            />
          </Section>

          <Section
            title="Current Medications"
            description="Medications this pet is currently taking."
            icon={Pill}
          >
            <InfoList
              empty="No medications recorded."
              items={records.medications.map((item) => ({
                title: item.name,
                detail: [item.dosage, item.notes].filter(Boolean).join(" · "),
              }))}
            />
          </Section>

          <Section
            title="Allergies"
            description="Known allergies and reactions."
            icon={AlertTriangle}
          >
            <InfoList
              empty="No allergies recorded."
              items={records.allergies.map((item) => ({
                title: item.name,
                detail: [item.reaction, item.notes].filter(Boolean).join(" · "),
              }))}
            />
          </Section>

          <Section
            title="Vaccination Status"
            description="Vaccines given and next due dates."
            icon={Syringe}
          >
            <InfoList
              empty="No vaccinations recorded."
              items={records.vaccinations.map((item) => ({
                title: item.name,
                detail: [
                  item.dateGiven ? `Given: ${item.dateGiven}` : null,
                  item.nextDue ? `Next due: ${item.nextDue}` : null,
                  item.notes,
                ]
                  .filter(Boolean)
                  .join(" · "),
              }))}
            />
          </Section>
        </div>

        {records.veterinaryRecords?.trim() ? (
          <Section
            title="Veterinary Documents & Notes"
            description="Additional veterinary history and document notes."
            icon={FileText}
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground print:text-xs">
              {records.veterinaryRecords}
            </p>
          </Section>
        ) : null}

        {records.additionalNotes?.trim() ? (
          <Section
            title="Additional Notes"
            description="Extra details shared for emergency care."
            icon={FileText}
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground print:text-xs">
              {records.additionalNotes}
            </p>
          </Section>
        ) : null}

        <p className="hidden text-center text-xs text-muted-foreground print:block">
          Generated by Universal Health Charts · Emergency Pet Summary for{" "}
          {records.name}
        </p>
      </div>
    </div>
  )
}

export default function PetEmergencyAccessPage({
  params,
}: PetEmergencyAccessPageProps) {
  const { token } = use(params)
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [records, setRecords] = useState<PublicPetEmergencyRecords | null>(null)

  const challengeQuery = useFetch<PublicPetEmergencyChallenge>({
    path: PET_EMERGENCY_ACCESS_API.publicChallenge(token),
    queryKey: PET_EMERGENCY_ACCESS_QUERY_KEYS.publicChallenge(token),
    retry: false,
    enabled: !records,
  })

  const unlockApi = useApi<{ pin: string }>({
    key: "unlock-pet-emergency-access",
    method: "post",
    showSuccessToast: false,
  })

  function handleUnlock(event: React.FormEvent) {
    event.preventDefault()

    unlockApi.onRequest<PublicPetEmergencyRecords>({
      path: PET_EMERGENCY_ACCESS_API.unlock(token),
      data: { pin },
      onSuccess: (data) => {
        setRecords(data)
      },
    })
  }

  if (records) {
    return <PetEmergencyProfileView records={records} />
  }

  return (
    <div className="mx-auto max-w-md px-5 pb-24 pt-8 sm:px-6 sm:pb-10 sm:pt-10">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <PawPrint className="size-7" aria-hidden />
        </span>
        <Typography variant="h2">Pet Emergency Access</Typography>
        {challengeQuery.isLoading ? null : challengeQuery.isError ||
          !challengeQuery.data ? (
          <Typography variant="muted" className="mt-2">
            Unable to load pet emergency access challenge.
          </Typography>
        ) : (
          <Typography variant="muted" className="mt-2">
            Enter the PIN to unlock {challengeQuery.data.petNameHint}&apos;s pet
            profile ({challengeQuery.data.petInitials}).
          </Typography>
        )}
      </div>

      {challengeQuery.isLoading ? (
        <Loader variant="fetch" label="Loading access challenge..." />
      ) : challengeQuery.isError || !challengeQuery.data ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <Typography
            variant="small"
            className="inline-flex items-center gap-2 font-medium text-destructive"
          >
            <AlertTriangle className="size-4" aria-hidden />
            This pet emergency link is invalid, expired, or revoked.
          </Typography>
        </div>
      ) : (
        <form
          onSubmit={handleUnlock}
          className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
        >
          <Typography variant="muted" className="text-sm">
            Expires {new Date(challengeQuery.data.expiresAt).toLocaleString()}
          </Typography>
          <div className="relative">
            <Input
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              maxLength={4}
              placeholder="4-digit PIN"
              value={pin}
              onChange={(event) =>
                setPin(event.target.value.replace(/\D/g, "").slice(0, 4))
              }
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPin((value) => !value)}
              aria-label={showPin ? "Hide PIN" : "Show PIN"}
            >
              {showPin ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={unlockApi.isPending || pin.length !== 4}
          >
            {unlockApi.isPending ? "Unlocking..." : "Unlock Pet Profile"}
          </Button>
        </form>
      )}
    </div>
  )
}
