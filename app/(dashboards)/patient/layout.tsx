import type { Metadata } from "next"
import DashboardShell from "@/app/(dashboards)/patient/_components/dashboard-shell"
import MfaSetupGuard from "@/app/(dashboards)/patient/_components/mfa-setup-guard"
import MustChangePasswordGuard from "@/app/(dashboards)/patient/_components/must-change-password-guard"
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
      <MustChangePasswordGuard>
        {/* MFA enrollment must run before profile/subscription/shell fetches —
            those patient APIs return 403 until authenticator MFA is enabled. */}
        <MfaSetupGuard page={children}>
          <OnboardingGuard>
            <SubscriptionGuard>
              <DashboardShell>{children}</DashboardShell>
            </SubscriptionGuard>
          </OnboardingGuard>
        </MfaSetupGuard>
      </MustChangePasswordGuard>
    </AuthGuard>
  )
}
