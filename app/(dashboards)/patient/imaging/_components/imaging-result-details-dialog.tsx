"use client"

import { Calendar, FileText, Pencil, ScanLine, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import type { ImagingResult } from "@/app/(dashboards)/patient/_lib/imaging"
import ImagingFilePreview from "@/app/(dashboards)/patient/imaging/_components/imaging-file-preview"
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
import useToast from "@/hooks/use-toast"

type ImagingResultDetailsDialogProps = {
  result: ImagingResult | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (result: ImagingResult) => void
}

export default function ImagingResultDetailsDialog({
  result,
  open,
  onOpenChange,
  onDelete,
}: ImagingResultDetailsDialogProps) {
  const { toastSuccess } = useToast()
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!result) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
            <div className="flex items-start gap-4 pr-8">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ScanLine className="size-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-xl">{result.fileName}</DialogTitle>
                <DialogDescription className="mt-1">
                  {result.scanType} · {result.testType}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="thin-scrollbar max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailRow
                icon={FileText}
                label="File Name"
                value={result.fileName}
              />
              <DetailRow
                icon={ScanLine}
                label="Test Type"
                value={result.testType}
              />
              <DetailRow
                icon={ScanLine}
                label="Scan Type"
                value={result.scanType}
              />
              <DetailRow
                icon={Calendar}
                label="Scan Date"
                value={result.scanDate}
              />
            </div>

            <div className="space-y-2">
              <Typography variant="small" className="font-semibold">
                Imaging Scan
              </Typography>
              <ImagingFilePreview result={result} />
            </div>
          </div>

          <div className="flex flex-row flex-wrap items-center gap-2 border-t border-border/60 bg-muted/20 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 gap-1.5"
              asChild
            >
              <Link
                href={`/patient/imaging/${result.id}/edit`}
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
            <AlertDialogTitle>Delete imaging record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {result.fileName} from your imaging
              records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete(result)
                setDeleteOpen(false)
                onOpenChange(false)
                toastSuccess("Imaging record deleted.")
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
  icon: typeof FileText
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
        <Typography variant="small" className="mt-0.5 font-medium break-all">
          {value}
        </Typography>
      </div>
    </div>
  )
}
