"use client"

import { Users } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { useMemo } from "react"
import { UserAvatar } from "@/app/(dashboards)/admin/_lib/user-avatar"
import { UserStatusBadge } from "@/app/(dashboards)/admin/_lib/user-status-badge"
import {
  type AdminUser,
  formatJoinedDate,
  formatPlan,
} from "@/app/(dashboards)/admin/_lib/users"
import EmptyCard from "@/components/empty-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import { USERS_API, USERS_QUERY_KEYS } from "@/lib/api/users"

const RECENT_USERS_LIMIT = 5

export default function RecentUsersCard() {
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

  const recentUsers = useMemo(() => users.slice(0, RECENT_USERS_LIMIT), [users])

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-4" aria-hidden />
          </span>
          <CardTitle>Recent Users</CardTitle>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          asChild
        >
          <Link href={"/admin/users" as Route}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-2 sm:px-6">
        {isLoading ? (
          <Loader
            variant="fetch"
            label="Loading recent users..."
            className="py-12"
          />
        ) : isError ? (
          <div className="px-4 pb-4 sm:px-0">
            <Typography variant="muted" className="text-center text-sm">
              {error?.message ?? "Failed to load recent users."}
            </Typography>
            <div className="mt-4 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isFetching}
                onClick={() => refetch()}
              >
                {isFetching ? <Loader variant="button" /> : "Try again"}
              </Button>
            </div>
          </div>
        ) : recentUsers.length === 0 ? (
          <div className="px-4 pb-4 sm:px-0">
            <EmptyCard
              title="No users yet"
              description="Registered patient accounts will appear here."
              icon={Users}
            />
          </div>
        ) : (
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[140px]">Name</TableHead>
                  <TableHead className="min-w-[180px]">Email</TableHead>
                  <TableHead className="min-w-[130px]">Plan</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[110px]">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                        <Typography variant="small" className="font-medium">
                          {user.name}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>{formatPlan(user.plan)}</TableCell>
                    <TableCell>
                      <UserStatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {formatJoinedDate(user.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
