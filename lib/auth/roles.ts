import type { UserRole } from "@/lib/auth/types"

export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const satisfies Record<string, UserRole>

export function isAdmin(role: UserRole) {
  return role === USER_ROLES.ADMIN
}

export function isUser(role: UserRole) {
  return role === USER_ROLES.USER
}

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]) {
  return allowedRoles.includes(userRole)
}

export function getRoleLabel(role: UserRole) {
  return role === USER_ROLES.ADMIN ? "Administrator" : "Patient"
}
