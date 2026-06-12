"use client"

import { AlertTriangle, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import {
  ALLERGY_TYPE_FOOD,
  type Allergy,
  formatTriggersList,
} from "@/app/(dashboards)/patient/_lib/allergies"
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
import useToast from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type AllergyDetailsDialogProps = {
  allergy: Allergy | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (allergy: Allergy) => void
}

function getNatureBadgeClass(nature: string) {
  if (nature === "Very Severe" || nature === "Severe") {
    return "bg-destructive/10 text-destructive border-destructive/20"
  }
  if (nature === "Moderate") {
    return "bg-amber-100 text-amber-800 border-amber-200"
  }
  return "bg-muted text-muted-foreground border-border"
}

export default function AllergyDetailsDialog({
  allergy,
  open,
  onOpenChange,
  onDelete,
}: AllergyDetailsDialogProps) {
  const { toastSuccess } = useToast()
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!allergy) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
            <div className="flex items-start gap-4 pr-8">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-xl">
                  {allergy.allergyType}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Allergy record details
                </DialogDescription>
                <Badge
                  variant="outline"
                  className={cn(
                    "mt-2 rounded-full",
                    getNatureBadgeClass(allergy.nature)
                  )}
                >
                  {allergy.nature}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <DetailBlock label="Symptoms" value={allergy.symptoms.join(", ")} />
            {allergy.allergyType === ALLERGY_TYPE_FOOD ? (
              <DetailBlock
                label="Food Triggers"
                value={formatTriggersList(allergy.triggers)}
              />
            ) : null}
          </div>

          <div className="flex flex-row flex-wrap items-center gap-2 border-t border-border/60 bg-muted/20 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 gap-1.5"
              asChild
            >
              <Link
                href={`/patient/allergies/${allergy.id}/edit`}
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
            <AlertDialogTitle>Delete allergy?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this{" "}
              {allergy.allergyType.toLowerCase()} allergy record. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete(allergy)
                setDeleteOpen(false)
                onOpenChange(false)
                toastSuccess("Allergy deleted.")
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

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-background px-4 py-3">
      <Typography variant="muted" className="text-xs">
        {label}
      </Typography>
      <Typography variant="small" className="mt-1 font-medium">
        {value}
      </Typography>
    </div>
  )
}
