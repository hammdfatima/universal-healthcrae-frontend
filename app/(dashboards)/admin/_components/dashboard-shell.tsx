"use client"

import { useState } from "react"

import AdminFooter from "@/app/(dashboards)/admin/_components/footer"
import AdminHeader from "@/app/(dashboards)/admin/_components/header"
import AdminSidebar from "@/app/(dashboards)/admin/_components/sidebar"

type DashboardShellProps = {
  children: React.ReactNode
}

export default function AdminDashboardShell({
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col gap-3 bg-muted/50 p-3">
      <div className="flex min-h-0 flex-1 items-stretch gap-3">
        <AdminSidebar
          mobileOpen={mobileOpen}
          onMobileOpenChange={setMobileOpen}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <AdminHeader onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
      <AdminFooter />
    </div>
  )
}
