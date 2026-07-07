import type { PaymentStatus } from "@/lib/api/admin-payments"

export type { AdminPayment, PaymentStatus } from "@/lib/api/admin-payments"

export function formatPaymentStatus(status: PaymentStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
