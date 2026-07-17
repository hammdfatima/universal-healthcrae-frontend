import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"

import { Typography } from "@/components/ui/typography"

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const

const authItems = [
  { label: "Log in", href: "/login" },
  { label: "Sign up", href: "/signup" },
] as const

const legalItems = [
  { label: "Privacy Policy", href: "/privacy-policy" as Route },
  { label: "Terms of Use", href: "/terms-of-use" as Route },
  {
    label: "Emergency Access Authorization",
    href: "/emergency-access-authorization" as Route,
  },
] as const

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-primary/20 bg-secondary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex rounded-xl bg-white px-3 py-2"
            >
              <Image
                src="/logo.png"
                alt="Universal Health Charts"
                width={320}
                height={80}
                className="h-9 w-auto sm:h-10"
                quality={100}
                sizes="(max-width: 640px) 200px, 240px"
              />
            </Link>
            <Typography
              variant="p"
              color="inherit"
              className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/80"
            >
              Your family&apos;s healthcare information, all in one place —
              secure, accessible, and ready when it matters most.
            </Typography>
          </div>

          <div>
            <Typography
              as="h3"
              variant="h6"
              color="inherit"
              className="text-primary-foreground"
            >
              Quick Links
            </Typography>
            <nav
              aria-label="Footer navigation"
              className="mt-4 flex flex-col gap-2"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <Typography
              as="h3"
              variant="h6"
              color="inherit"
              className="text-primary-foreground"
            >
              Legal
            </Typography>
            <nav aria-label="Legal links" className="mt-4 flex flex-col gap-2">
              {legalItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <Typography
              as="h3"
              variant="h6"
              color="inherit"
              className="text-primary-foreground"
            >
              Get Started
            </Typography>
            <nav
              aria-label="Account links"
              className="mt-4 flex flex-col gap-2"
            >
              {authItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Typography
              variant="muted"
              color="inherit"
              className="mt-6 text-sm text-primary-foreground/70"
            >
              Plans from $9.95/month
            </Typography>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-8 sm:flex-row">
          <Typography
            variant="small"
            color="inherit"
            className="text-primary-foreground/70"
          >
            &copy; {year} Universal Health Charts. All rights reserved.
          </Typography>
          <Typography
            variant="small"
            color="inherit"
            className="text-primary-foreground/70"
          >
            Secure. Portable. Accessible Anywhere.
          </Typography>
        </div>
      </div>
    </footer>
  )
}
