import type { UserStatus } from "@/app/(dashboards)/admin/_lib/users"
import { Badge } from "@/components/ui/badge"

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge
      variant="outline"
      className={
        status === "active"
          ? "rounded-full border-primary/30 bg-primary/10 text-primary capitalize"
          : status === "cancelled" || status === "blocked"
            ? "rounded-full border-destructive/30 bg-destructive/10 text-destructive capitalize"
            : "rounded-full capitalize"
      }
    >
      {status}
    </Badge>
  )
}
