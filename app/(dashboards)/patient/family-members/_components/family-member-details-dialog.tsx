"use client"

import {
  AlertTriangle,
  Mail,
  Pencil,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import type { FamilyMember } from "@/app/(dashboards)/patient/_lib/family-members"
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

type FamilyMemberDetailsDialogProps = {
  member: FamilyMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMarkEmergencyContact: (member: FamilyMember) => void
  onDelete: (member: FamilyMember) => void
}

function getInitials(member: FamilyMember) {
  return `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`.toUpperCase()
}

export default function FamilyMemberDetailsDialog({
  member,
  open,
  onOpenChange,
  onMarkEmergencyContact,
  onDelete,
}: FamilyMemberDetailsDialogProps) {
  const { toastSuccess } = useToast()
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!member) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
            <div className="flex items-center gap-4 pr-8">
              <Avatar className="size-14 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
                  {getInitials(member)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <DialogTitle className="text-xl">
                  {member.firstName} {member.lastName}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {member.relationship}
                </DialogDescription>
                {member.isEmergencyContact ? (
                  <Badge className="mt-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/10">
                    Emergency Contact
                  </Badge>
                ) : null}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <DetailRow
              icon={UserRound}
              label="Date of Birth"
              value={member.dateOfBirth}
            />
            <DetailRow icon={Phone} label="Phone" value={member.phone} />
            <DetailRow icon={Mail} label="Email" value={member.email} />
          </div>

          <div className="flex flex-row flex-wrap items-center gap-2 border-t border-border/60 bg-muted/20 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="min-w-0 flex-1 gap-1.5"
              onClick={() => {
                onMarkEmergencyContact(member)
                toastSuccess(
                  member.isEmergencyContact
                    ? "Removed from emergency contacts."
                    : "Marked as emergency contact."
                )
              }}
            >
              <AlertTriangle className="size-4 shrink-0" aria-hidden />
              <span className="truncate">
                {member.isEmergencyContact
                  ? "Remove Emergency"
                  : "Mark Emergency"}
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1 gap-1.5"
              asChild
            >
              <Link
                href={`/patient/family-members/${member.id}/edit`}
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
            <AlertDialogTitle>Delete family member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {member.firstName} {member.lastName}{" "}
              from your family list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete(member)
                setDeleteOpen(false)
                onOpenChange(false)
                toastSuccess("Family member deleted.")
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
  icon: typeof UserRound
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
