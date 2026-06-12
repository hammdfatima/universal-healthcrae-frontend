export const adminStats = {
  totalUsers: 1284,
  activeSubscriptions: 976,
  monthlyRevenue: "$12,480",
  paymentsThisMonth: 342,
} as const

export const paymentsChartData = [
  { month: "Jan", revenue: 9840, payments: 298 },
  { month: "Feb", revenue: 10250, payments: 305 },
  { month: "Mar", revenue: 11020, payments: 318 },
  { month: "Apr", revenue: 11580, payments: 326 },
  { month: "May", revenue: 11940, payments: 335 },
  { month: "Jun", revenue: 12480, payments: 342 },
  { month: "Jul", revenue: 12120, payments: 338 },
  { month: "Aug", revenue: 11860, payments: 331 },
  { month: "Sep", revenue: 12240, payments: 340 },
  { month: "Oct", revenue: 12680, payments: 348 },
  { month: "Nov", revenue: 12920, payments: 352 },
  { month: "Dec", revenue: 13150, payments: 356 },
] as const

export type AdminUser = {
  id: string
  name: string
  email: string
  plan: string
  status: "active" | "inactive" | "cancelled"
  joined: string
}

export const adminUsers: AdminUser[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    plan: "Individual Plan",
    status: "active",
    joined: "Jan 12, 2025",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    plan: "Family Plan",
    status: "active",
    joined: "Feb 3, 2025",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "mchen@email.com",
    plan: "Couple Plan",
    status: "active",
    joined: "Mar 18, 2025",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    plan: "Individual Plan",
    status: "cancelled",
    joined: "Nov 8, 2024",
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "rwilson@email.com",
    plan: "Family Plan",
    status: "inactive",
    joined: "Dec 22, 2024",
  },
]

export {
  type AdminPayment,
  initialAdminPayments as adminPayments,
} from "@/app/(dashboards)/admin/_lib/payments"
