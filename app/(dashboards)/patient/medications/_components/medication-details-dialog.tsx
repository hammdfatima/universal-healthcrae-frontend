"use client"

import {
  Activity,
  Calendar,
  Clock,
  Pencil,
  Stethoscope,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import {
  formatMedicationEndDate,
  formatMedicationSchedule,
  isMedicationActive,
} from "@/app/(dashboards)/patient/_lib/medications"
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
import type { Medication } from "@/lib/api/medications"

type MedicationDetailsDialogProps = {
  medication: Medication | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (medication: Medication) => void
  isDeleting?: boolean
  readOnly?: boolean
}

export default function MedicationDetailsDialog({
  medication,
  open,
  onOpenChange,
  onDelete,
  isDeleting = false,
  readOnly = false,
}: MedicationDetailsDialogProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!medication) return null

  const isActive = isMedicationActive(medication.endDate)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
            <div className="flex items-start gap-4 pr-8">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Activity className="size-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-xl">
                  {medication.medicineName}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {medication.condition}
                </DialogDescription>
                {isActive ? (
                  <Badge className="mt-2 rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                    Active
                  </Badge>
                ) : null}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <DetailRow
              icon={Stethoscope}
              label="Prescribed By"
              value={medication.prescribedBy}
            />
            <DetailRow
              icon={Activity}
              label="Dosage"
              value={medication.dosage}
            />
            <DetailRow
              icon={Clock}
              label="Schedule"
              value={formatMedicationSchedule(medication)}
            />
            <DetailRow
              icon={Calendar}
              label="Start Date"
              value={medication.startDate}
            />
            <DetailRow
              icon={Calendar}
              label="End Date"
              value={formatMedicationEndDate(medication.endDate)}
            />
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
                  href={`/patient/medications/${medication.id}/edit`}
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
            <AlertDialogTitle>Delete medication?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {medication.medicineName} from your
              medication list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={() => {
                onDelete?.(medication)
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
  icon: typeof Activity
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
