"use client"

import { Mail, PawPrint, Phone } from "lucide-react"

import { getPetAgeLabel } from "@/app/(dashboards)/patient/_lib/pets"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Typography } from "@/components/ui/typography"
import type { Pet } from "@/lib/api/pets"

function DetailList({
  title,
  items,
  empty,
}: {
  title: string
  items: string[]
  empty: string
}) {
  return (
    <div>
      <Typography variant="small" className="font-medium">
        {title}
      </Typography>
      {items.length === 0 ? (
        <Typography variant="muted" className="mt-1 text-sm">
          {empty}
        </Typography>
      ) : (
        <ul className="mt-2 space-y-1">
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

function DetailField({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div>
      <Typography variant="small" className="font-medium">
        {label}
      </Typography>
      <Typography variant="muted" className="mt-1 text-sm">
        {value?.trim() || "—"}
      </Typography>
    </div>
  )
}

export default function PetDetailsPanel({ pet }: { pet: Pet }) {
  const ageLabel = getPetAgeLabel(pet.dateOfBirth)

  return (
    <div className="space-y-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar className="size-16 border-2 border-primary/20">
          {pet.profileImage ? (
            <AvatarImage src={pet.profileImage} alt={pet.name} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary">
            <PawPrint className="size-7" aria-hidden />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <Typography as="h2" variant="h4">
            {pet.name}
          </Typography>
          <Typography variant="muted" className="mt-1">
            {pet.species}
            {pet.breed ? ` · ${pet.breed}` : ""}
            {ageLabel ? ` · ${ageLabel}` : ""}
          </Typography>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailField label="Sex" value={pet.sex} />
        <DetailField label="Date of Birth" value={pet.dateOfBirth} />
        <DetailField label="Weight" value={pet.weight} />
        <DetailField label="Color / Markings" value={pet.color} />
        <DetailField label="Microchip Number" value={pet.microchipId} />
      </div>

      <div>
        <Typography variant="small" className="font-medium">
          Owner Contact
        </Typography>
        <div className="mt-2 space-y-1">
          <Typography variant="muted" className="text-sm">
            {pet.ownerName?.trim() || "—"}
          </Typography>
          {pet.ownerPhone ? (
            <Typography
              variant="muted"
              className="inline-flex items-center gap-1 text-sm"
            >
              <Phone className="size-3.5" aria-hidden />
              {pet.ownerPhone}
            </Typography>
          ) : null}
          {pet.ownerEmail ? (
            <Typography
              variant="muted"
              className="inline-flex items-center gap-1 text-sm"
            >
              <Mail className="size-3.5" aria-hidden />
              {pet.ownerEmail}
            </Typography>
          ) : null}
        </div>
      </div>

      <div>
        <Typography variant="small" className="font-medium">
          Emergency Contact
        </Typography>
        {pet.emergencyContact ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {pet.emergencyContact.firstName} {pet.emergencyContact.lastName}
            </Badge>
            <Typography variant="muted" className="text-sm">
              {pet.emergencyContact.relationship}
            </Typography>
            {pet.emergencyContact.phone ? (
              <Typography
                variant="muted"
                className="inline-flex items-center gap-1 text-sm"
              >
                <Phone className="size-3.5" aria-hidden />
                {pet.emergencyContact.phone}
              </Typography>
            ) : null}
          </div>
        ) : (
          <Typography variant="muted" className="mt-1 text-sm">
            None assigned
          </Typography>
        )}
      </div>

      <div>
        <Typography variant="small" className="font-medium">
          Primary Veterinarian
        </Typography>
        <Typography variant="muted" className="mt-1 text-sm">
          {pet.veterinaryClinic ?? "—"}
          {pet.veterinaryPhone ? ` · ${pet.veterinaryPhone}` : ""}
        </Typography>
      </div>

      <div>
        <Typography variant="small" className="font-medium">
          Emergency Veterinary Clinic
        </Typography>
        <Typography variant="muted" className="mt-1 text-sm">
          {pet.emergencyVeterinaryClinic?.trim() || "—"}
          {pet.emergencyVeterinaryPhone
            ? ` · ${pet.emergencyVeterinaryPhone}`
            : ""}
        </Typography>
      </div>

      {pet.veterinaryRecords?.trim() ? (
        <div>
          <Typography variant="small" className="font-medium">
            Veterinary Documents & Notes
          </Typography>
          <Typography
            variant="muted"
            className="mt-1 whitespace-pre-wrap text-sm"
          >
            {pet.veterinaryRecords}
          </Typography>
        </div>
      ) : null}

      {pet.additionalNotes?.trim() ? (
        <div>
          <Typography variant="small" className="font-medium">
            Additional Notes
          </Typography>
          <Typography
            variant="muted"
            className="mt-1 whitespace-pre-wrap text-sm"
          >
            {pet.additionalNotes}
          </Typography>
        </div>
      ) : null}

      <DetailList
        title="Medical Conditions"
        empty="No medical conditions recorded."
        items={pet.medicalConditions.map((item) =>
          [item.name, item.notes].filter(Boolean).join(" · ")
        )}
      />
      <DetailList
        title="Current Medications"
        empty="No medications recorded."
        items={pet.medications.map((item) =>
          [item.name, item.dosage, item.notes].filter(Boolean).join(" · ")
        )}
      />
      <DetailList
        title="Allergies"
        empty="No allergies recorded."
        items={pet.allergies.map((item) =>
          [item.name, item.reaction, item.notes].filter(Boolean).join(" · ")
        )}
      />
      <DetailList
        title="Vaccination Status"
        empty="No vaccinations recorded."
        items={pet.vaccinations.map((item) =>
          [item.name, item.dateGiven, item.nextDue, item.notes]
            .filter(Boolean)
            .join(" · ")
        )}
      />
    </div>
  )
}
