"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Eye, ShieldBan, ShieldCheck, Users } from "lucide-react"
import { useMemo, useState } from "react"
import { UserAvatar } from "@/app/(dashboards)/admin/_lib/user-avatar"
import { UserStatusBadge } from "@/app/(dashboards)/admin/_lib/user-status-badge"
import {
  type AdminUser,
  formatJoinedDate,
  formatPlan,
  USER_STATUS_FILTER_OPTIONS,
} from "@/app/(dashboards)/admin/_lib/users"
import UserDetailsDialog from "@/app/(dashboards)/admin/users/_components/user-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { USERS_API, USERS_QUERY_KEYS } from "@/lib/api/users"

export default function UsersTable() {
  const queryClient = useQueryClient()
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [blockUser, setBlockUser] = useState<AdminUser | null>(null)
  const [unblockUser, setUnblockUser] = useState<AdminUser | null>(null)

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFetch<AdminUser[]>({
    path: USERS_API.admin.list,
    queryKey: USERS_QUERY_KEYS.admin,
  })

  const { onRequest: blockUserRequest, isPending: isBlocking } = useApi<
    Record<string, never>
  >({
    key: "block-user",
    method: "patch",
  })

  const { onRequest: unblockUserRequest, isPending: isUnblocking } = useApi<
    Record<string, never>
  >({
    key: "unblock-user",
    method: "patch",
  })

  const isMutating = isBlocking || isUnblocking

  function invalidateUsers() {
    queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.admin })
  }

  function handleBlock(user: AdminUser) {
    blockUserRequest({
      path: USERS_API.admin.block(user.id),
      data: {},
      onSuccess: () => {
        invalidateUsers()
        setBlockUser(null)
        if (selectedUser?.id === user.id) {
          setSelectedUser({ ...user, status: "blocked", isBlocked: true })
        }
      },
    })
  }

  function handleUnblock(user: AdminUser) {
    unblockUserRequest({
      path: USERS_API.admin.unblock(user.id),
      data: {},
      onSuccess: () => {
        invalidateUsers()
        setUnblockUser(null)
        if (selectedUser?.id === user.id) {
          setSelectedUser({
            ...user,
            status: user.emailVerified ? "active" : "inactive",
            isBlocked: false,
          })
        }
      },
    })
  }

  const columns: DataTableColumn<AdminUser>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        searchable: true,
        cell: (row) => (
          <div className="flex items-center gap-3">
            <UserAvatar user={row} />
            <Typography variant="small" className="font-medium">
              {row.name}
            </Typography>
          </div>
        ),
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        searchable: true,
        headerClassName: "hidden sm:table-cell",
        className: "hidden sm:table-cell",
      },
      {
        id: "plan",
        header: "Plan",
        accessorKey: "plan",
        cell: (row) => formatPlan(row.plan),
        headerClassName: "hidden md:table-cell",
        className: "hidden md:table-cell",
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: (row) => <UserStatusBadge status={row.status} />,
      },
      {
        id: "joined",
        header: "Joined",
        cell: (row) => formatJoinedDate(row.createdAt),
        headerClassName: "hidden lg:table-cell",
        className: "hidden lg:table-cell tabular-nums",
      },
      {
        id: "actions",
        header: "",
        searchable: false,
        className: "w-28 text-right",
        headerClassName: "w-28 text-right",
        cell: (row) => (
          <div className="flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              className="size-8 rounded-full"
              aria-label={`View details for ${row.name}`}
              disabled={isMutating}
              onClick={() => {
                setSelectedUser(row)
                setDetailsOpen(true)
              }}
            >
              <Eye className="size-4" aria-hidden />
            </Button>
            {row.isBlocked ? (
              <Button
                type="button"
                variant="ghost"
                className="size-8 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
                aria-label={`Unblock ${row.name}`}
                disabled={isMutating}
                onClick={() => setUnblockUser(row)}
              >
                <ShieldCheck className="size-4" aria-hidden />
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="size-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Block ${row.name}`}
                disabled={isMutating}
                onClick={() => setBlockUser(row)}
              >
                <ShieldBan className="size-4" aria-hidden />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [isMutating]
  )

  return (
    <>
      <DataTable
        title="Users"
        description="View and manage registered patient accounts."
        icon={<Users className="size-6" aria-hidden />}
        columns={columns}
        data={users}
        getRowId={(row) => row.id}
        searchPlaceholder="Search users..."
        isLoading={isLoading}
        loadingLabel="Loading users..."
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching && !isLoading}
        filters={[
          {
            id: "status",
            label: "Status",
            accessorKey: "status",
            options: [...USER_STATUS_FILTER_OPTIONS],
          },
        ]}
        emptyMessage="No users found"
        emptyDescription="Registered patient accounts will appear here."
        filteredEmptyDescription="No users match your search or filters. Try adjusting them."
      />

      <UserDetailsDialog
        user={selectedUser}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setSelectedUser(null)
        }}
        onBlock={(user) => setBlockUser(user)}
        onUnblock={(user) => setUnblockUser(user)}
        isMutating={isMutating}
      />

      <AlertDialog
        open={Boolean(blockUser)}
        onOpenChange={(open) => {
          if (!open) setBlockUser(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block user?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">
                {blockUser?.name}
              </span>{" "}
              will no longer be able to log in or access the platform until
              unblocked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBlocking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isBlocking}
              onClick={() => {
                if (blockUser) handleBlock(blockUser)
              }}
            >
              {isBlocking ? (
                <Loader variant="button" color="white" />
              ) : (
                "Block User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(unblockUser)}
        onOpenChange={(open) => {
          if (!open) setUnblockUser(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unblock user?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">
                {unblockUser?.name}
              </span>{" "}
              will regain access and be able to log in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnblocking}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isUnblocking}
              onClick={() => {
                if (unblockUser) handleUnblock(unblockUser)
              }}
            >
              {isUnblocking ? (
                <Loader variant="button" color="white" />
              ) : (
                "Unblock User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
