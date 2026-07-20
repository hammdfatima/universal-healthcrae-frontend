"use client"

import { MapPin, NotebookPen, Pencil, Phone, Trash2 } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { useState } from "react"

import { getPharmacyInitials } from "@/app/(dashboards)/patient/_lib/pharmacies"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"
import type { Pharmacy } from "@/lib/api/pharmacies"

type PharmacyDetailsDialogProps = {
  pharmacy: Pharmacy | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (pharmacy: Pharmacy) => void
  isDeleting?: boolean
  canManage?: boolean
}

export default function PharmacyDetailsDialog({
  pharmacy,
  open,
  onOpenChange,
  onDelete,
  isDeleting = false,
  canManage = true,
}: PharmacyDetailsDialogProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!pharmacy) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
            <div className="flex items-center gap-4 pr-8">
              <Avatar className="size-14 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
                  {getPharmacyInitials(pharmacy.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <DialogTitle className="text-xl">{pharmacy.name}</DialogTitle>
                <DialogDescription className="mt-1">
                  Preferred pharmacy
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <DetailRow icon={Phone} label="Phone" value={pharmacy.phone} />
            <DetailRow
              icon={MapPin}
              label="Address"
              value={pharmacy.address?.trim() || "—"}
            />
            <DetailRow
              icon={NotebookPen}
              label="Notes"
              value={pharmacy.notes?.trim() || "—"}
            />
          </div>

          {canManage ? (
            <div className="flex flex-row flex-wrap items-center gap-2 border-t border-border/60 bg-muted/20 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-1.5"
                asChild
              >
                <Link
                  href={`/patient/pharmacy/${pharmacy.id}/edit` as Route}
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

      {canManage && onDelete ? (
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete pharmacy?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove {pharmacy.name} from your preferred
                pharmacies. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
                onClick={() => {
                  onDelete(pharmacy)
                  setDeleteOpen(false)
                  onOpenChange(false)
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone
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
