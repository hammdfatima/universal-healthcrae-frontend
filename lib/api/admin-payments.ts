export type PaymentStatus = "paid" | "pending" | "failed"

export type AdminPayment = {
  id: string
  invoiceNumber: string
  user: string
  email: string
  phone: string | null
  address: string | null
  plan: string
  amount: string
  status: PaymentStatus
  date: string
  billingCycle: string
  paymentMethod: string
  transactionId: string
}

export type AdminPaymentsListResponse = {
  payments: AdminPayment[]
}

export const ADMIN_PAYMENTS_API = {
  list: "/admin/payments",
  get: (id: string) => `/admin/payments/${id}`,
} as const

export const ADMIN_PAYMENTS_QUERY_KEYS = {
  list: ["admin-payments", "list"] as const,
  detail: (id: string) => ["admin-payments", "detail", id] as const,
}
