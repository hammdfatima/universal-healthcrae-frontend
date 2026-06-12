import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign up | Universal Health Charts",
  description:
    "Create your Universal Health Charts account and secure your health records.",
}

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
