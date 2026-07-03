export type UserStatus = "active" | "inactive" | "cancelled" | "blocked"

export type AdminUser = {
  id: string
  name: string
  email: string
  firstName: string | null
  lastName: string | null
  profileImage: string | null
  plan: string | null
  status: UserStatus
  isBlocked: boolean
  emailVerified: boolean
  role: string
  createdAt: string
  updatedAt: string
}

export const USER_STATUS_FILTER_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Blocked", value: "blocked" },
] as const

export function formatJoinedDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate))
}

export function formatPlan(plan: string | null): string {
  return plan ?? "No plan"
}

export function getUserInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}
