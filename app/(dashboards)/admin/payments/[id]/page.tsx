"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import {
  type AdminPayment,
  getPaymentById,
} from "@/app/(dashboards)/admin/_lib/payments"
import PaymentInvoiceView from "@/app/(dashboards)/admin/payments/_components/payment-invoice-view"
import { Typography } from "@/components/ui/typography"

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>()
  const [payment, setPayment] = useState<AdminPayment | null>(null)

  useEffect(() => {
    setPayment(getPaymentById(params.id) ?? null)
  }, [params.id])

  if (!payment) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Payment not found</Typography>
        <Typography variant="muted" className="mt-2">
          This invoice may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return <PaymentInvoiceView payment={payment} />
}
