import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Forgot Password | Universal Health Charts",
  description: "Reset your Universal Health Charts account password.",
}

export default function ForgotPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
