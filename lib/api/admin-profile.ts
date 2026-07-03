export const ADMIN_PROFILE_API = {
  get: "/admin/profile",
  update: "/admin/profile",
  changePassword: "/admin/change-password",
} as const

export const ADMIN_PROFILE_QUERY_KEYS = {
  profile: ["admin", "profile"] as const,
}
