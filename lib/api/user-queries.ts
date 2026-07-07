export type UserQuerySubject = "general" | "support" | "billing" | "partnership"

export type UserQuery = {
  id: string
  fullName: string
  email: string
  subject: string
  subjectLabel: string
  message: string
  isResolved: boolean
  reply: string | null
  repliedAt: string | null
  createdAt: string
  updatedAt: string
}

export type UserQueriesListResponse = {
  queries: UserQuery[]
}

export type CreateUserQueryPayload = {
  fullName: string
  email: string
  subject: UserQuerySubject
  message: string
}

export type ReplyUserQueryPayload = {
  reply: string
}

export const USER_QUERIES_API = {
  create: "/user-queries",
  admin: {
    list: "/admin/user-queries",
    get: (id: string) => `/admin/user-queries/${id}`,
    reply: (id: string) => `/admin/user-queries/${id}/reply`,
  },
} as const

export const USER_QUERIES_QUERY_KEYS = {
  adminList: ["admin-user-queries", "list"] as const,
  adminDetail: (id: string) => ["admin-user-queries", "detail", id] as const,
}

export const USER_QUERY_SUBJECT_OPTIONS = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "billing", label: "Billing & Subscriptions" },
  { value: "partnership", label: "Partnership" },
] as const

export function formatUserQueryDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
