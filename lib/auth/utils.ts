import type { AuthUser } from "@/lib/auth/types"

export function getUserDisplayName(user: AuthUser) {
  if (user.name?.trim()) {
    return user.name.trim()
  }

  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim()
  return fullName || user.email
}

export function getUserInitials(user: AuthUser) {
  const first = user.firstName?.trim()?.[0] ?? user.email[0] ?? ""
  const last = user.lastName?.trim()?.[0] ?? ""
  const initials = `${first}${last}`.toUpperCase()

  return initials || "U"
}
