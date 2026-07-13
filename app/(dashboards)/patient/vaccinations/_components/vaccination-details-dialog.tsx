"use client"

import {
  Calendar,
  Clock,
  Pencil,
  Stethoscope,
  Syringe,
  Trash2,
  User,
} from "lucide-react"
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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"
import type { Vaccination } from "@/lib/api/vaccinations"

type VaccinationDetailsDialogProps = {
  vaccination: Vaccination | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (vaccination: Vaccination) => void
  isDeleting?: boolean
  readOnly?: boolean
}

export default function VaccinationDetailsDialog({
  vaccination,
  open,
  onOpenChange,
  onDelete,
  isDeleting = false,
  readOnly = false,
}: VaccinationDetailsDialogProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!vaccination) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
            <div className="flex items-start gap-4 pr-8">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Syringe className="size-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-xl">
                  {vaccination.vaccineName}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {vaccination.date} at {vaccination.time}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <DetailRow
              icon={Stethoscope}
              label="Prescribed By"
              value={vaccination.prescribedBy}
            />
            <DetailRow
              icon={User}
              label="Administrated by"
              value={vaccination.administeredBy}
            />
            <DetailRow
              icon={Syringe}
              label="Dosage"
              value={vaccination.dosage}
            />
            <DetailRow icon={Calendar} label="Date" value={vaccination.date} />
            <DetailRow icon={Clock} label="Time" value={vaccination.time} />
          </div>

          {!readOnly ? (
            <div className="flex flex-row flex-wrap items-center gap-2 border-t border-border/60 bg-muted/20 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-1.5"
                asChild
              >
                <Link
                  href={`/patient/vaccinations/${vaccination.id}/edit`}
                  onClick={() => onOpenChange(false)}
                >
                  <Pencil className="size-4 shrink-0" aria-hidden />
                  Edit
                </Link>
              </Button>

              <Button
                type="button"
                variant="destructive"
                className="flex-1 gap-1.5"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4 shrink-0" aria-hidden />
                Delete
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete vaccination?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {vaccination.vaccineName} from your
              immunization records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={() => {
                onDelete?.(vaccination)
                setDeleteOpen(false)
                onOpenChange(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Syringe
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-background px-4 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <Typography variant="muted" className="text-xs">
          {label}
        </Typography>
        <Typography variant="small" className="mt-0.5 font-medium">
          {value}
        </Typography>
      </div>
    </div>
  )
}
