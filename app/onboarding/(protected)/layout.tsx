import AuthGuard from "@/components/auth/auth-guard"
import { USER_ROLES } from "@/lib/auth/roles"

export default function ProtectedOnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthGuard allowedRoles={[USER_ROLES.USER]}>{children}</AuthGuard>
}
