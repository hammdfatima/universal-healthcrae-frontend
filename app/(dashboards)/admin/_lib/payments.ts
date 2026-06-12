export type PaymentStatus = "paid" | "pending" | "failed"

export type AdminPayment = {
  id: string
  invoiceNumber: string
  user: string
  email: string
  plan: string
  amount: string
  status: PaymentStatus
  date: string
  billingCycle: string
  paymentMethod: string
  transactionId: string
}

export const initialAdminPayments: AdminPayment[] = [
  {
    id: "1",
    invoiceNumber: "INV-2026-0001",
    user: "John Smith",
    email: "john.smith@email.com",
    plan: "Individual Plan",
    amount: "$9.95",
    status: "paid",
    date: "Jun 12, 2026",
    billingCycle: "Monthly",
    paymentMethod: "Visa ending in 4242",
    transactionId: "txn_8f2a91bc",
  },
  {
    id: "2",
    invoiceNumber: "INV-2026-0002",
    user: "Sarah Johnson",
    email: "sarah.j@email.com",
    plan: "Family Plan",
    amount: "$29.95",
    status: "paid",
    date: "Jun 11, 2026",
    billingCycle: "Monthly",
    paymentMethod: "Mastercard ending in 8210",
    transactionId: "txn_3c7d44ef",
  },
  {
    id: "3",
    invoiceNumber: "INV-2026-0003",
    user: "Michael Chen",
    email: "mchen@email.com",
    plan: "Couple Plan",
    amount: "$19.95",
    status: "paid",
    date: "Jun 10, 2026",
    billingCycle: "Monthly",
    paymentMethod: "Visa ending in 1098",
    transactionId: "txn_91ab22de",
  },
  {
    id: "4",
    invoiceNumber: "INV-2026-0004",
    user: "Emily Davis",
    email: "emily.davis@email.com",
    plan: "Individual Plan",
    amount: "$9.95",
    status: "failed",
    date: "Jun 9, 2026",
    billingCycle: "Monthly",
    paymentMethod: "Visa ending in 5521",
    transactionId: "txn_failed_01",
  },
  {
    id: "5",
    invoiceNumber: "INV-2026-0005",
    user: "Robert Wilson",
    email: "rwilson@email.com",
    plan: "Family Plan",
    amount: "$29.95",
    status: "pending",
    date: "Jun 8, 2026",
    billingCycle: "Yearly",
    paymentMethod: "American Express ending in 3005",
    transactionId: "txn_pending_02",
  },
]

export const PAYMENTS_STORAGE_KEY = "uhc-admin-payments"

export function getPaymentsFromStorage(): AdminPayment[] {
  if (typeof window === "undefined") return initialAdminPayments

  try {
    const stored = localStorage.getItem(PAYMENTS_STORAGE_KEY)
    if (!stored) return initialAdminPayments
    return JSON.parse(stored) as AdminPayment[]
  } catch {
    return initialAdminPayments
  }
}

export function savePaymentsToStorage(payments: AdminPayment[]) {
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments))
}

export function getPaymentById(id: string): AdminPayment | undefined {
  return getPaymentsFromStorage().find((payment) => payment.id === id)
}

export function formatPaymentStatus(status: PaymentStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
