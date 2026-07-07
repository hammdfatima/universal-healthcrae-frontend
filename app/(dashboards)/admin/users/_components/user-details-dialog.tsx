"use client"

import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Mail,
  UserRound,
  Users,
} from "lucide-react"
import type { ReactNode } from "react"
import { UserAvatar } from "@/app/(dashboards)/admin/_lib/user-avatar"
import { UserStatusBadge } from "@/app/(dashboards)/admin/_lib/user-status-badge"
import {
  type AdminUser,
  formatFamilyMemberCount,
  formatFamilyMemberEligibility,
  formatJoinedDate,
  formatPlan,
} from "@/app/(dashboards)/admin/_lib/users"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

type UserDetailsDialogProps = {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onBlock?: (user: AdminUser) => void
  onUnblock?: (user: AdminUser) => void
  isMutating?: boolean
}

type DetailRowProps = {
  icon: typeof Mail
  label: string
  value: ReactNode
  className?: string
}

function DetailRow({ icon: Icon, label, value, className }: DetailRowProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3",
        className
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background text-primary">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <Typography variant="muted" className="text-xs uppercase tracking-wide">
          {label}
        </Typography>
        <div className="mt-0.5 font-medium text-sm break-all">{value}</div>
      </div>
    </div>
  )
}

export default function UserDetailsDialog({
  user,
  open,
  onOpenChange,
  onBlock,
  onUnblock,
  isMutating = false,
}: UserDetailsDialogProps) {
  if (!user) return null

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.name

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
          <div className="flex items-center gap-4 pr-8">
            <UserAvatar
              user={user}
              className="size-14 border-2 border-primary/20"
              fallbackClassName="text-base"
            />
            <div className="min-w-0">
              <DialogTitle className="text-xl">{user.name}</DialogTitle>
              <DialogDescription className="mt-1">
                Patient account details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
          <DetailRow icon={Mail} label="Email" value={user.email} />
          <DetailRow icon={UserRound} label="Full name" value={fullName} />
          <DetailRow
            icon={CreditCard}
            label="Plan"
            value={formatPlan(user.plan)}
          />
          <DetailRow
            icon={CheckCircle2}
            label="Status"
            value={<UserStatusBadge status={user.status} />}
          />
          <DetailRow
            icon={Calendar}
            label="Joined"
            value={formatJoinedDate(user.createdAt)}
          />
          <DetailRow
            icon={Calendar}
            label="Last updated"
            value={formatJoinedDate(user.updatedAt)}
          />
          <DetailRow
            icon={CheckCircle2}
            label="Email verified"
            value={user.emailVerified ? "Yes" : "No"}
            className="sm:col-span-2"
          />

          {user.isFamilyMemberAccount && user.addedBy ? (
            <DetailRow
              icon={Users}
              label="Added by"
              value={
                <div>
                  <div>{user.addedBy.name}</div>
                  <Typography variant="muted" className="text-sm">
                    {user.addedBy.email}
                  </Typography>
                </div>
              }
              className="sm:col-span-2"
            />
          ) : (
            <>
              <DetailRow
                icon={Users}
                label="Family members"
                value={formatFamilyMemberCount(user.familyMemberCount)}
              />
              <DetailRow
                icon={Users}
                label="Can add"
                value={formatFamilyMemberEligibility(user)}
              />
            </>
          )}
        </div>

        <DialogFooter className="border-t border-border/60 px-6 py-4 sm:justify-end">
          {user.isBlocked ? (
            <Button
              type="button"
              disabled={isMutating}
              onClick={() => onUnblock?.(user)}
            >
              Unblock User
            </Button>
          ) : (
            <Button
              type="button"
              variant="destructive"
              disabled={isMutating}
              onClick={() => onBlock?.(user)}
            >
              Block User
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
