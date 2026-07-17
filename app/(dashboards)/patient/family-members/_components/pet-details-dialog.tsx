"use client"

import { AlertTriangle, PawPrint, Pencil, Phone, Trash2 } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"
import type { Pet } from "@/lib/api/pets"

type PetDetailsDialogProps = {
  pet: Pet | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (pet: Pet) => void
  isDeleting?: boolean
  readOnly?: boolean
}

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

export default function PetDetailsDialog({
  pet,
  open,
  onOpenChange,
  onDelete,
  isDeleting = false,
  readOnly = false,
}: PetDetailsDialogProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!pet) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
            <div className="flex items-center gap-4 pr-8">
              <span className="flex size-14 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 text-primary">
                <PawPrint className="size-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-xl">{pet.name}</DialogTitle>
                <DialogDescription className="mt-1">
                  {pet.species}
                  {pet.breed ? ` · ${pet.breed}` : ""}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Typography variant="small" className="font-medium">
                  Sex
                </Typography>
                <Typography variant="muted" className="mt-1 text-sm">
                  {pet.sex ?? "—"}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="font-medium">
                  Date of Birth
                </Typography>
                <Typography variant="muted" className="mt-1 text-sm">
                  {pet.dateOfBirth ?? "—"}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="font-medium">
                  Color
                </Typography>
                <Typography variant="muted" className="mt-1 text-sm">
                  {pet.color ?? "—"}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="font-medium">
                  Microchip
                </Typography>
                <Typography variant="muted" className="mt-1 text-sm">
                  {pet.microchipId ?? "—"}
                </Typography>
              </div>
            </div>

            <div>
              <Typography variant="small" className="font-medium">
                Veterinary Clinic
              </Typography>
              <Typography variant="muted" className="mt-1 text-sm">
                {pet.veterinaryClinic ?? "—"}
                {pet.veterinaryPhone ? ` · ${pet.veterinaryPhone}` : ""}
              </Typography>
            </div>

            <div>
              <Typography variant="small" className="font-medium">
                Veterinary Records
              </Typography>
              <Typography
                variant="muted"
                className="mt-1 whitespace-pre-wrap text-sm"
              >
                {pet.veterinaryRecords?.trim() || "—"}
              </Typography>
            </div>

            <div>
              <Typography variant="small" className="font-medium">
                Emergency Contact
              </Typography>
              {pet.emergencyContact ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {pet.emergencyContact.firstName}{" "}
                    {pet.emergencyContact.lastName}
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

            <DetailList
              title="Medications"
              empty="No medications recorded."
              items={pet.medications.map((item) =>
                [item.name, item.dosage, item.notes].filter(Boolean).join(" · ")
              )}
            />
            <DetailList
              title="Allergies"
              empty="No allergies recorded."
              items={pet.allergies.map((item) =>
                [item.name, item.reaction, item.notes]
                  .filter(Boolean)
                  .join(" · ")
              )}
            />
            <DetailList
              title="Vaccinations"
              empty="No vaccinations recorded."
              items={pet.vaccinations.map((item) =>
                [item.name, item.dateGiven, item.nextDue, item.notes]
                  .filter(Boolean)
                  .join(" · ")
              )}
            />
          </div>

          {!readOnly ? (
            <div className="flex flex-col-reverse gap-2 border-t border-border/60 px-6 py-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" aria-hidden />
                Delete Pet
              </Button>
              <Button type="button" asChild>
                <Link
                  href={`/patient/family-members/pets/${pet.id}/edit` as Route}
                >
                  <Pencil className="size-4" aria-hidden />
                  Edit Pet
                </Link>
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" aria-hidden />
              Delete {pet.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes {pet.name}&apos;s veterinary records from
              your family account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={() => {
                onDelete?.(pet)
                setDeleteOpen(false)
                onOpenChange(false)
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
