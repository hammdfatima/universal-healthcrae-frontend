export type AdminDashboardCounts = {
  totalUsers: number
  activeSubscriptions: number
  monthlyRevenue: string
  paymentsThisMonth: number
}

export type AdminPaymentsChartItem = {
  month: string
  revenue: number
  payments: number
}

export type AdminDashboardStatsResponse = {
  counts: AdminDashboardCounts
  paymentsChart: AdminPaymentsChartItem[]
}

export const ADMIN_DASHBOARD_API = {
  stats: "/admin/dashboard/stats",
} as const

export const ADMIN_DASHBOARD_QUERY_KEYS = {
  stats: ["admin-dashboard", "stats"] as const,
}
