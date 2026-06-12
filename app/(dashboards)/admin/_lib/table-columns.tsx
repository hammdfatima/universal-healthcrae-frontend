import type { AdminPayment } from "@/app/(dashboards)/admin/_lib/payments"
import type { AdminUser } from "@/app/(dashboards)/admin/_lib/mock-data"
import { Badge } from "@/components/ui/badge"
import type { DataTableColumn } from "@/components/data-table"

export const userColumns: DataTableColumn<AdminUser>[] = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    searchable: true,
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
    headerClassName: "hidden md:table-cell",
    className: "hidden md:table-cell",
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <Badge
        variant="outline"
        className={
          row.status === "active"
            ? "rounded-full border-primary/30 bg-primary/10 text-primary"
            : row.status === "cancelled"
              ? "rounded-full border-destructive/30 bg-destructive/10 text-destructive"
              : "rounded-full"
        }
      >
        {row.status}
      </Badge>
    ),
  },
  {
    id: "joined",
    header: "Joined",
    accessorKey: "joined",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
  },
]

export const paymentColumns: DataTableColumn<AdminPayment>[] = [
  {
    id: "user",
    header: "User",
    accessorKey: "user",
    searchable: true,
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
    headerClassName: "hidden md:table-cell",
    className: "hidden md:table-cell",
  },
  {
    id: "amount",
    header: "Amount",
    accessorKey: "amount",
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <Badge
        variant="outline"
        className={
          row.status === "paid"
            ? "rounded-full border-primary/30 bg-primary/10 text-primary"
            : row.status === "failed"
              ? "rounded-full border-destructive/30 bg-destructive/10 text-destructive"
              : "rounded-full border-amber-500/30 bg-amber-500/10 text-amber-700"
        }
      >
        {row.status}
      </Badge>
    ),
  },
  {
    id: "date",
    header: "Date",
    accessorKey: "date",
    headerClassName: "hidden lg:table-cell",
    className: "hidden lg:table-cell",
  },
]
