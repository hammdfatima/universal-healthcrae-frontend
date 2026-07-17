"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { SessionEndReason } from "@/lib/auth/constants"

const SESSION_END_COPY: Record<
  SessionEndReason,
  { title: string; description: string; action: string }
> = {
  expired: {
    title: "Session expired",
    description: "Your session has expired. Please sign in again to continue.",
    action: "Login again",
  },
  inactive: {
    title: "Signed out due to inactivity",
    description:
      "You were signed out because of inactivity. Please sign in again to continue.",
    action: "Login again",
  },
  blocked: {
    title: "Account blocked",
    description:
      "Your account has been blocked. Please contact support if you need help.",
    action: "Login again",
  },
  revoked: {
    title: "Session expired",
    description: "Your session has expired. Please sign in again to continue.",
    action: "Login again",
  },
  family_access: {
    title: "Family access ended",
    description:
      "Your family member canceled or changed the subscription. Upgrade to get your account back, or contact the account holder.",
    action: "Back to login",
  },
}

type SessionExpiredModalProps = {
  open: boolean
  reason: SessionEndReason | null
  onConfirm: () => void
}

export default function SessionExpiredModal({
  open,
  reason,
  onConfirm,
}: SessionExpiredModalProps) {
  if (!reason) {
    return null
  }

  const copy = SESSION_END_COPY[reason]

  return (
    <AlertDialog open={open} onOpenChange={() => {}}>
      <AlertDialogContent
        className="sm:max-w-md"
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.title}</AlertDialogTitle>
          <AlertDialogDescription>{copy.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm}>
            {copy.action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
