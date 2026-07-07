"use client"

import { useParams } from "next/navigation"

import PaymentInvoiceView from "@/app/(dashboards)/admin/payments/_components/payment-invoice-view"
import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { useFetch } from "@/hooks/use-fetch"
import {
  ADMIN_PAYMENTS_API,
  ADMIN_PAYMENTS_QUERY_KEYS,
  type AdminPayment,
} from "@/lib/api/admin-payments"

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>()

  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<AdminPayment>({
      path: ADMIN_PAYMENTS_API.get(params.id),
      queryKey: ADMIN_PAYMENTS_QUERY_KEYS.detail(params.id),
    })

  if (isLoading) {
    return <PaymentInvoiceView isLoading />
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg py-12">
        <ErrorCard
          error={error}
          onRetry={() => refetch()}
          isLoading={isFetching}
        />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <EmptyCard
          title="Payment not found"
          description="This invoice may have been removed or the link is invalid."
        />
      </div>
    )
  }

  return <PaymentInvoiceView payment={data} />
}
