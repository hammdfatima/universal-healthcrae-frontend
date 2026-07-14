"use client"

import { Download } from "lucide-react"
import Image from "next/image"
import { downloadPaymentInvoicePdf } from "@/app/(dashboards)/admin/_lib/download-payment-invoice-pdf"
import {
  type AdminPayment,
  formatPaymentStatus,
} from "@/app/(dashboards)/admin/_lib/payments"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { ensureCurrencyPrice } from "@/lib/subscription/format-price"
import { cn } from "@/lib/utils"

type PaymentInvoiceViewProps = {
  payment?: AdminPayment | null
  isLoading?: boolean
}

export default function PaymentInvoiceView({
  payment,
  isLoading = false,
}: PaymentInvoiceViewProps) {
  if (isLoading || !payment) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Typography as="h1" variant="h3">
              Invoice Details
            </Typography>
            <Typography variant="muted" className="mt-1">
              Loading invoice...
            </Typography>
          </div>
        </div>

        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardContent className="flex min-h-[420px] items-center justify-center py-16">
            <Loader label="Loading invoice..." />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Typography as="h1" variant="h3">
            Invoice Details
          </Typography>
          <Typography variant="muted" className="mt-1">
            {payment.invoiceNumber} · {payment.date}
          </Typography>
        </div>
        <Button
          type="button"
          className="gap-1.5 self-start"
          onClick={() => void downloadPaymentInvoicePdf(payment)}
        >
          <Download className="size-4" aria-hidden />
          Download Invoice
        </Button>
      </div>

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-0">
          <div className="border-b border-border/60 bg-muted/30 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <Image
                  src="/logo-half.png"
                  alt="Universal Health Charts"
                  width={80}
                  height={80}
                  className="size-14 shrink-0 object-contain"
                  quality={100}
                />
                <div>
                  <Typography variant="small" className="font-semibold">
                    Universal Health Charts
                  </Typography>
                  <Typography variant="muted" className="mt-1 text-sm">
                    Platform Invoice
                  </Typography>
                  <Typography variant="muted" className="mt-1 text-xs">
                    support@universalhealthcharts.com
                  </Typography>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <Typography variant="h4">{payment.invoiceNumber}</Typography>
                <Typography variant="muted" className="mt-1 text-sm">
                  {payment.date}
                </Typography>
                <Badge
                  variant="outline"
                  className={cn(
                    "mt-2 rounded-full capitalize",
                    payment.status === "paid" &&
                      "border-primary/30 bg-primary/10 text-primary",
                    payment.status === "failed" &&
                      "border-destructive/30 bg-destructive/10 text-destructive",
                    payment.status === "pending" &&
                      "border-amber-500/30 bg-amber-500/10 text-amber-700"
                  )}
                >
                  {formatPaymentStatus(payment.status)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-8 px-6 py-8 sm:px-8">
            <section>
              <Typography
                variant="muted"
                className="text-xs font-semibold tracking-wider uppercase"
              >
                Bill To
              </Typography>
              <Typography variant="small" className="mt-2 font-semibold">
                {payment.user}
              </Typography>
              <Typography variant="muted" className="text-sm">
                {payment.email}
              </Typography>
              {payment.phone ? (
                <Typography variant="muted" className="text-sm">
                  {payment.phone}
                </Typography>
              ) : null}
              {payment.address ? (
                <Typography variant="muted" className="text-sm">
                  {payment.address}
                </Typography>
              ) : null}
            </section>

            <section>
              <div className="overflow-hidden rounded-xl border border-border/60">
                <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-border/60 bg-muted/20 px-4 py-3 text-sm font-semibold">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-4">
                  <div>
                    <Typography variant="small" className="font-medium">
                      {payment.plan}
                    </Typography>
                    <Typography variant="muted" className="text-sm">
                      {payment.billingCycle} subscription
                    </Typography>
                  </div>
                  <Typography
                    variant="small"
                    className="font-semibold tabular-nums"
                  >
                    {ensureCurrencyPrice(payment.amount)}
                  </Typography>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-4 border-t border-border/60 bg-muted/10 px-4 py-4">
                  <Typography variant="small" className="font-semibold">
                    Total
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-bold tabular-nums"
                  >
                    {ensureCurrencyPrice(payment.amount)}
                  </Typography>
                </div>
              </div>
            </section>

            <Typography variant="muted" className="text-center text-sm">
              Thank you for your subscription to Universal Health Charts.
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
