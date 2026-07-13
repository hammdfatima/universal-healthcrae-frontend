export type AdminAuditLog = {
  id: string
  action: string
  resourceType: string
  resourceId: string | null
  actorUserId: string | null
  actorRole: string | null
  actorEmail: string | null
  ip: string | null
  userAgent: string | null
  metadata: unknown | null
  createdAt: string
}

export type AdminAuditLogsListResponse = {
  auditLogs: AdminAuditLog[]
}

export const ADMIN_AUDIT_LOGS_API = {
  list: "/admin/audit-logs",
} as const

export const ADMIN_AUDIT_LOGS_QUERY_KEYS = {
  list: ["admin-audit-logs", "list"] as const,
}
