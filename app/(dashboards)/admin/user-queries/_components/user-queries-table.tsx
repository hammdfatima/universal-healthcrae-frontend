"use client"

import { Eye, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import {
  formatUserQueryDate,
  USER_QUERIES_API,
  USER_QUERIES_QUERY_KEYS,
  type UserQueriesListResponse,
  type UserQuery,
} from "@/lib/api/user-queries"

export default function UserQueriesTable() {
  const router = useRouter()

  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<UserQueriesListResponse>({
      path: USER_QUERIES_API.admin.list,
      queryKey: USER_QUERIES_QUERY_KEYS.adminList,
    })

  const queries = data?.queries ?? []

  const columns: DataTableColumn<UserQuery>[] = [
    {
      id: "fullName",
      header: "Name",
      accessorKey: "fullName",
      searchable: true,
      cell: (row) => (
        <Typography variant="small" className="font-medium">
          {row.fullName}
        </Typography>
      ),
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      searchable: true,
      headerClassName: "hidden md:table-cell",
      className: "hidden md:table-cell",
    },
    {
      id: "subject",
      header: "Subject",
      accessorKey: "subjectLabel",
      headerClassName: "hidden lg:table-cell",
      className: "hidden lg:table-cell",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          variant="outline"
          className={
            row.isResolved
              ? "rounded-full border-primary/30 bg-primary/10 text-primary"
              : "rounded-full border-amber-500/30 bg-amber-500/10 text-amber-700"
          }
        >
          {row.isResolved ? "Resolved" : "Open"}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      header: "Submitted",
      cell: (row) => (
        <Typography
          variant="small"
          className="tabular-nums text-muted-foreground"
        >
          {formatUserQueryDate(row.createdAt)}
        </Typography>
      ),
      headerClassName: "hidden xl:table-cell",
      className: "hidden xl:table-cell",
    },
    {
      id: "actions",
      header: "",
      searchable: false,
      className: "w-12 text-right",
      headerClassName: "w-12 text-right",
      cell: (row) => (
        <Button
          type="button"
          variant="ghost"
          className="size-8 rounded-full"
          aria-label={`View query from ${row.fullName}`}
          onClick={() => router.push(`/admin/user-queries/${row.id}`)}
        >
          <Eye className="size-4" aria-hidden />
        </Button>
      ),
    },
  ]

  return (
    <DataTable
      title="User Queries"
      description="Review contact form submissions and send replies."
      data={queries}
      columns={columns}
      getRowId={(row) => row.id}
      searchPlaceholder="Search queries..."
      icon={<MessageSquare className="size-6" aria-hidden />}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      isRetrying={isFetching && !isLoading}
      emptyMessage="No user queries yet."
      emptyDescription="Messages submitted through the contact form will appear here."
      filters={[
        {
          id: "status",
          label: "Status",
          options: [
            { label: "Open", value: "open" },
            { label: "Resolved", value: "resolved" },
          ],
          filterFn: (row, value) => {
            if (value === "open") return !row.isResolved
            if (value === "resolved") return row.isResolved
            return true
          },
        },
      ]}
    />
  )
}
