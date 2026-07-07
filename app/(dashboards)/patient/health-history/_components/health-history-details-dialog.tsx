"use client"

import {
  Calendar,
  FileText,
  History,
  Pencil,
  Stethoscope,
  Trash2,
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
import type { HealthHistoryEntry } from "@/lib/api/health-history"

type HealthHistoryDetailsDialogProps = {
  entry: HealthHistoryEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (entry: HealthHistoryEntry) => void
  isDeleting?: boolean
}

export default function HealthHistoryDetailsDialog({
  entry,
  open,
  onOpenChange,
  onDelete,
  isDeleting = false,
}: HealthHistoryDetailsDialogProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!entry) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
            <div className="flex items-start gap-4 pr-8">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <History className="size-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-xl">
                  {entry.illnessName}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Diagnosed on {entry.diagnosisDate}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <DetailRow
              icon={Calendar}
              label="Date of Diagnosis"
              value={entry.diagnosisDate}
            />
            <DetailRow
              icon={Stethoscope}
              label="GP / Consultant Name"
              value={entry.prescribedBy}
            />
            <DetailRow icon={FileText} label="Details" value={entry.details} />
          </div>

          <div className="flex flex-row flex-wrap items-center gap-2 border-t border-border/60 bg-muted/20 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 gap-1.5"
              asChild
            >
              <Link
                href={`/patient/health-history/${entry.id}/edit`}
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
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete diagnosis?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {entry.illnessName} from your health
              history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={() => {
                onDelete(entry)
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
  icon: typeof History
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
        <Typography
          variant="small"
          className="mt-0.5 font-medium whitespace-pre-wrap"
        >
          {value}
        </Typography>
      </div>
    </div>
  )
}
