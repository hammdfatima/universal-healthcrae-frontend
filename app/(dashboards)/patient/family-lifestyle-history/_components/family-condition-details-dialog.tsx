"use client"

import { useEffect, useState } from "react"

import {
  FAMILY_CONDITION_LABELS,
  type FamilyConditionEntry,
  type FamilyConditionKey,
} from "@/app/(dashboards)/patient/_lib/family-lifestyle-history"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Typography } from "@/components/ui/typography"

type FamilyConditionDetailsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  conditionId: FamilyConditionKey | null
  details: string
  readOnly?: boolean
  onSave?: (details: string) => void
}

export default function FamilyConditionDetailsDialog({
  open,
  onOpenChange,
  conditionId,
  details,
  readOnly = false,
  onSave,
}: FamilyConditionDetailsDialogProps) {
  const [draft, setDraft] = useState(details)

  useEffect(() => {
    if (open) {
      setDraft(details)
    }
  }, [details, open])

  if (!conditionId) return null

  const title = FAMILY_CONDITION_LABELS[conditionId]

  function handleSave() {
    onSave?.(draft.trim())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Details</DialogTitle>
          <DialogDescription>
            Add additional details for {title}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Typography variant="small" className="font-semibold">
            {title}
          </Typography>
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Describe diagnosis, treatment, age at onset, or other relevant details."
            rows={5}
            readOnly={readOnly}
          />
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {readOnly ? "Close" : "Cancel"}
          </Button>
          {!readOnly ? (
            <Button type="button" onClick={handleSave}>
              Save Details
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export type { FamilyConditionEntry }
