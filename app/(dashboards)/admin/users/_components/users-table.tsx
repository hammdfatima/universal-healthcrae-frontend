"use client"

import { Users } from "lucide-react"

import { adminUsers } from "@/app/(dashboards)/admin/_lib/mock-data"
import { userColumns } from "@/app/(dashboards)/admin/_lib/table-columns"
import { DataTable } from "@/components/data-table"

export default function UsersTable() {
  return (
    <DataTable
      title="Users"
      description="View and manage registered patient accounts."
      data={adminUsers}
      columns={userColumns}
      getRowId={(row) => row.id}
      searchPlaceholder="Search users..."
      icon={<Users className="size-6" aria-hidden />}
    />
  )
}
