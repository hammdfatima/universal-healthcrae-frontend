"use client"

import PetDetailsPanel from "@/app/(dashboards)/patient/pets/_components/pet-details-panel"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Pet } from "@/lib/api/pets"

type PetDetailsDialogProps = {
  pet: Pet | null
  open: boolean
  onOpenChange: (open: boolean) => void
  readOnly?: boolean
}

/** Read-only pet preview used from shared records views. */
export default function PetDetailsDialog({
  pet,
  open,
  onOpenChange,
}: PetDetailsDialogProps) {
  if (!pet) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{pet.name}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto p-4">
          <PetDetailsPanel pet={pet} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
