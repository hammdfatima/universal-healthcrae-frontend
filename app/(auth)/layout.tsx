import type { Metadata } from "next"

import GuestGuard from "@/components/auth/guest-guard"
import AuthLayoutShell from "./_components/auth-layout-shell"

export const metadata: Metadata = {
  title: "Account",
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <GuestGuard>
      <AuthLayoutShell>{children}</AuthLayoutShell>
    </GuestGuard>
  )
}
