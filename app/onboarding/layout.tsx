import OnboardingFooter from "@/app/onboarding/_components/onboarding-footer"
import OnboardingHeader from "@/app/onboarding/_components/onboarding-header"
import AuthGuard from "@/components/auth/auth-guard"
import { USER_ROLES } from "@/lib/auth/roles"

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGuard allowedRoles={[USER_ROLES.USER]}>
      <div className="flex min-h-screen flex-col gap-3 bg-muted/50 p-3">
        <OnboardingHeader />
        <main className="flex-1 py-6 sm:py-8">{children}</main>
        <OnboardingFooter />
      </div>
    </AuthGuard>
  )
}
