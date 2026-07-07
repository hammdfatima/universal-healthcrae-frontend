export type UserStatus = "active" | "inactive" | "cancelled" | "blocked"

export type AdminUserAddedBy = {
  id: string
  name: string
  email: string
}

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
  isFamilyMemberAccount: boolean
  addedBy: AdminUserAddedBy | null
  familyMemberCount: number
  familyMemberLimit: number
  canAddFamilyMembers: boolean
  familyMembersRemaining: number
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

export function formatFamilyMemberCount(count: number): string {
  if (count === 0) return "No family members added"
  if (count === 1) return "1 family member added"
  return `${count} family members added`
}

export function formatFamilyMemberEligibility(user: AdminUser): string {
  if (user.isFamilyMemberAccount) {
    return "Managed account — cannot add family members"
  }

  if (!user.canAddFamilyMembers) {
    if (!user.plan) {
      return "Cannot add family members without an active subscription"
    }

    return "Cannot add family members on the current plan"
  }

  if (user.familyMembersRemaining === 0) {
    return `Family member limit reached (${user.familyMemberCount}/${user.familyMemberLimit})`
  }

  if (user.familyMemberLimit === 1) {
    return `Can add 1 family member (${user.familyMembersRemaining} remaining)`
  }

  return `Can add up to ${user.familyMemberLimit} family members (${user.familyMembersRemaining} remaining)`
}

export function getUserInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}
