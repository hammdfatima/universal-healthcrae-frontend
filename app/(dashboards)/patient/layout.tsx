import type { Metadata } from "next"

import DashboardShell from "@/app/(dashboards)/patient/_components/dashboard-shell"
import OnboardingGuard from "@/app/(dashboards)/patient/_components/onboarding-guard"

export const metadata: Metadata = {
  title: "Patient Dashboard",
  description: "Manage your health records and medical vault.",
}

export default function PatientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <OnboardingGuard>
      <DashboardShell>{children}</DashboardShell>
    </OnboardingGuard>
  )
}
