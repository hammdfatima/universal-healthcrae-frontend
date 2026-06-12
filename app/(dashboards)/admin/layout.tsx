import type { Metadata } from "next"

import AdminDashboardShell from "@/app/(dashboards)/admin/_components/dashboard-shell"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage users, subscriptions, and payments.",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AdminDashboardShell>{children}</AdminDashboardShell>
}
