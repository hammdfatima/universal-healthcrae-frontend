import type { Metadata } from "next"
import AdminDashboardShell from "@/app/(dashboards)/admin/_components/dashboard-shell"
import AuthGuard from "@/components/auth/auth-guard"
import { USER_ROLES } from "@/lib/auth/roles"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage users, subscriptions, and payments.",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGuard allowedRoles={[USER_ROLES.ADMIN]}>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </AuthGuard>
  )
}
