import { Users } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"

import { adminUsers } from "@/app/(dashboards)/admin/_lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function RecentUsersCard() {
  const recentUsers = adminUsers.slice(0, 5)

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
                    <Typography variant="small" className="font-medium">
                      {user.name}
                    </Typography>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>{user.plan}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.status === "active"
                          ? "rounded-full border-primary/30 bg-primary/10 text-primary"
                          : user.status === "cancelled"
                            ? "rounded-full border-destructive/30 bg-destructive/10 text-destructive"
                            : "rounded-full"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {user.joined}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
