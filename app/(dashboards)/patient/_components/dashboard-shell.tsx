"use client"

import { useState } from "react"

import PatientFooter from "@/app/(dashboards)/patient/_components/footer"
import PatientHeader from "@/app/(dashboards)/patient/_components/header"
import PatientSidebar from "@/app/(dashboards)/patient/_components/sidebar"
import { useMedicationDoseReminders } from "@/hooks/use-medication-dose-reminders"
import { VaultPatientProvider } from "@/provider/vault-patient-provider"

type DashboardShellProps = {
  children: React.ReactNode
}

function MedicationReminderScheduler() {
  useMedicationDoseReminders(true)
  return null
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <VaultPatientProvider>
      <MedicationReminderScheduler />
      <div className="flex min-h-screen flex-col gap-3 bg-muted/50 p-3">
        <div className="flex min-h-0 flex-1 items-stretch gap-3">
          <PatientSidebar
            mobileOpen={mobileOpen}
            onMobileOpenChange={setMobileOpen}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <PatientHeader onMenuClick={() => setMobileOpen(true)} />
            <main className="flex-1">{children}</main>
          </div>
        </div>
        <PatientFooter />
      </div>
    </VaultPatientProvider>
  )
}
