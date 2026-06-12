"use client"

import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const

export default function Header() {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/logo.jpeg"
            alt="Universal Health Charts"
            width={320}
            height={80}
            className="h-10 w-auto sm:h-11"
            priority
            quality={100}
            sizes="(max-width: 640px) 200px, 240px"
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-secondary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" onClick={() => router.push("/login")}>
            Log in
          </Button>
          <Button onClick={() => router.push("/signup")}>Sign up</Button>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-border/70 bg-background md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-secondary"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3 border-t border-border/70 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setMobileOpen(false)
                router.push("/login")
              }}
            >
              Log in
            </Button>
            <Button
              onClick={() => {
                setMobileOpen(false)
                router.push("/signup")
              }}
            >
              Sign up
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
