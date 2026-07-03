import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import Provider from "@/provider"
import "./globals.css"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://universalhealthcharts.com"

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Universal Health Charts",
    template: "%s | Universal Health Charts",
  },
  description:
    "Your secure personal health record — store, access, and share your complete medical data in one place.",
  icons: {
    icon: "/logo-half.png",
    shortcut: "/logo-half.png",
    apple: "/logo-half.png",
  },
  openGraph: {
    title: "Universal Health Charts",
    description:
      "Your secure personal health record — store, access, and share your complete medical data in one place.",
    type: "website",
    images: [
      {
        url: "/logo-half.png",
        alt: "Universal Health Charts",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Universal Health Charts",
    description:
      "Your secure personal health record — store, access, and share your complete medical data in one place.",
    images: ["/logo-half.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased">
        <NuqsAdapter>
          <Provider>{children}</Provider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
