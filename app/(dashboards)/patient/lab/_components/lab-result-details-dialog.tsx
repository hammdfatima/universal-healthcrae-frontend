"use client"

import { Calendar, FileText, FlaskConical, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { getLabResultFileSource } from "@/app/(dashboards)/patient/_lib/lab"
import FilePreviewCard from "@/components/file-preview-card"
import FilePreviewDialog from "@/components/file-preview-dialog"
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
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import type { LabResult } from "@/lib/api/lab-results"

type LabResultDetailsDialogProps = {
  result: LabResult | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (result: LabResult) => void
  isDeleting?: boolean
  readOnly?: boolean
}

export default function LabResultDetailsDialog({
  result,
  open,
  onOpenChange,
  onDelete,
  isDeleting = false,
  readOnly = false,
}: LabResultDetailsDialogProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  if (!result) return null

  const fileSource = getLabResultFileSource(result)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
            <div className="flex items-start gap-4 pr-8">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FlaskConical className="size-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-xl">{result.fileName}</DialogTitle>
                <DialogDescription className="mt-1">
                  {result.testType}
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
                icon={FlaskConical}
                label="Test Type"
                value={result.testType}
              />
              <DetailRow
                icon={Calendar}
                label="Test Date"
                value={result.testDate}
              />
            </div>

            <div className="space-y-2">
              <Typography variant="small" className="font-semibold">
                Lab Report
              </Typography>
              {fileSource ? (
                <FilePreviewCard
                  fileName={result.fileName}
                  fileMimeType={result.fileMimeType}
                  onClick={() => setPreviewOpen(true)}
                />
              ) : (
                <Typography variant="muted" className="text-sm">
                  No file attached to this lab result.
                </Typography>
              )}
            </div>
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
                  href={`/patient/lab/${result.id}/edit`}
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

      <FilePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        fileName={result.fileName}
        fileMimeType={result.fileMimeType}
        fileSource={fileSource}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lab result?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {result.fileName} from your lab
              records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={() => {
                onDelete?.(result)
                setDeleteOpen(false)
                onOpenChange(false)
              }}
            >
              {isDeleting ? (
                <Loader variant="button" color="white" />
              ) : (
                "Delete"
              )}
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
