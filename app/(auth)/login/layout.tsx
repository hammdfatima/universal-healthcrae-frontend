import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Log in | Universal Health Charts",
  description: "Sign in to your Universal Health Charts account.",
}

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
