"use client"

import { CreditCard, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  type AdminPayment,
  getPaymentsFromStorage,
  initialAdminPayments,
} from "@/app/(dashboards)/admin/_lib/payments"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function PaymentsTable() {
  const router = useRouter()
  const [payments, setPayments] = useState<AdminPayment[]>(initialAdminPayments)

  useEffect(() => {
    setPayments(getPaymentsFromStorage())
  }, [])

  const columns: DataTableColumn<AdminPayment>[] = [
    {
      id: "invoiceNumber",
      header: "Invoice",
      accessorKey: "invoiceNumber",
      cell: (row) => (
        <Typography variant="small" className="font-medium tabular-nums">
          {row.invoiceNumber}
        </Typography>
      ),
      className: "hidden sm:table-cell",
      headerClassName: "hidden sm:table-cell",
    },
    {
      id: "user",
      header: "User",
      accessorKey: "user",
      searchable: true,
      cell: (row) => (
        <Typography variant="small" className="font-medium">
          {row.user}
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
      id: "plan",
      header: "Plan",
      accessorKey: "plan",
      headerClassName: "hidden lg:table-cell",
      className: "hidden lg:table-cell",
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      className: "tabular-nums",
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
      headerClassName: "hidden xl:table-cell",
      className: "hidden xl:table-cell tabular-nums",
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
          aria-label={`View invoice ${row.invoiceNumber}`}
          onClick={() => router.push(`/admin/payments/${row.id}`)}
        >
          <Eye className="size-4" aria-hidden />
        </Button>
      ),
    },
  ]

  return (
    <DataTable
      title="Payments"
      description="Track subscription payments and billing activity."
      data={payments}
      columns={columns}
      getRowId={(row) => row.id}
      searchPlaceholder="Search payments..."
      icon={<CreditCard className="size-6" aria-hidden />}
    />
  )
}
