export const USERS_API = {
  admin: {
    list: "/admin/users",
    block: (id: string) => `/admin/users/${id}/block`,
    unblock: (id: string) => `/admin/users/${id}/unblock`,
  },
} as const

export const USERS_QUERY_KEYS = {
  admin: ["users", "admin"] as const,
}
