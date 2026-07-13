"use client"

import { ScrollText } from "lucide-react"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import type { AdminAuditLog } from "@/lib/api/admin-audit-logs"
import {
  ADMIN_AUDIT_LOGS_API,
  ADMIN_AUDIT_LOGS_QUERY_KEYS,
  type AdminAuditLogsListResponse,
} from "@/lib/api/admin-audit-logs"

function formatActionLabel(action: string) {
  return action
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function actionBadgeClass(action: string) {
  if (action.includes("FAIL") || action.includes("DELETE")) {
    return "rounded-full border-destructive/30 bg-destructive/10 text-destructive"
  }

  if (
    action.includes("CREATE") ||
    action.includes("SUCCESS") ||
    action.includes("UNLOCK")
  ) {
    return "rounded-full border-primary/30 bg-primary/10 text-primary"
  }

  if (action.includes("UPDATE") || action.includes("BLOCK")) {
    return "rounded-full border-amber-500/30 bg-amber-500/10 text-amber-700"
  }

  return "rounded-full border-border/60 bg-muted/40 text-foreground"
}

export default function AuditLogsTable() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<AdminAuditLogsListResponse>({
      path: ADMIN_AUDIT_LOGS_API.list,
      queryKey: ADMIN_AUDIT_LOGS_QUERY_KEYS.list,
    })

  const auditLogs = data?.auditLogs ?? []

  const columns: DataTableColumn<AdminAuditLog>[] = [
    {
      id: "createdAt",
      header: "When",
      accessorKey: "createdAt",
      cell: (row) => (
        <Typography variant="small" className="tabular-nums">
          {new Date(row.createdAt).toLocaleString()}
        </Typography>
      ),
    },
    {
      id: "action",
      header: "Action",
      accessorKey: "action",
      searchable: true,
      cell: (row) => (
        <Badge variant="outline" className={actionBadgeClass(row.action)}>
          {formatActionLabel(row.action)}
        </Badge>
      ),
    },
    {
      id: "resourceType",
      header: "Resource",
      accessorKey: "resourceType",
      searchable: true,
      cell: (row) => (
        <div className="min-w-0">
          <Typography variant="small" className="font-medium">
            {row.resourceType}
          </Typography>
          {row.resourceId ? (
            <Typography
              variant="muted"
              className="mt-0.5 truncate text-xs tabular-nums"
            >
              {row.resourceId}
            </Typography>
          ) : null}
        </div>
      ),
    },
    {
      id: "actorEmail",
      header: "Actor",
      accessorKey: "actorEmail",
      searchable: true,
      cell: (row) => (
        <div className="min-w-0">
          <Typography variant="small" className="font-medium">
            {row.actorEmail ?? row.actorUserId ?? "System / anonymous"}
          </Typography>
          {row.actorRole ? (
            <Typography variant="muted" className="mt-0.5 text-xs">
              {row.actorRole}
            </Typography>
          ) : null}
        </div>
      ),
    },
    {
      id: "ip",
      header: "IP",
      accessorKey: "ip",
      className: "tabular-nums",
      cell: (row) => <Typography variant="small">{row.ip ?? "—"}</Typography>,
    },
  ]

  return (
    <DataTable
      title="Audit Logs"
      description="Security and PHI access events across the platform (most recent 300)."
      data={auditLogs}
      columns={columns}
      getRowId={(row) => row.id}
      searchPlaceholder="Search by action, resource, or actor..."
      icon={<ScrollText className="size-6" aria-hidden />}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      isRetrying={isFetching && !isLoading}
      emptyMessage="No audit logs yet."
      emptyDescription="Access, login, and emergency unlock events will appear here."
    />
  )
}
