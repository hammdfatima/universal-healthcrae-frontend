import type { Metadata } from "next"
import DashboardShell from "@/app/(dashboards)/patient/_components/dashboard-shell"
import OnboardingGuard from "@/app/(dashboards)/patient/_components/onboarding-guard"
import SubscriptionGuard from "@/app/(dashboards)/patient/_components/subscription-guard"
import AuthGuard from "@/components/auth/auth-guard"
import { USER_ROLES } from "@/lib/auth/roles"

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
    <AuthGuard allowedRoles={[USER_ROLES.USER]}>
      <OnboardingGuard>
        <SubscriptionGuard>
          <DashboardShell>{children}</DashboardShell>
        </SubscriptionGuard>
      </OnboardingGuard>
    </AuthGuard>
  )
}
