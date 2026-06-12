"use client"

import type { LucideIcon } from "lucide-react"
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Tags,
  Users,
} from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: Route
  icon: LucideIcon
}

const navItemBase =
  "flex items-center gap-3 rounded-full text-sm font-medium transition-colors"
const navItemActive = "bg-secondary text-secondary-foreground shadow-sm"
const navItemIdle =
  "text-foreground/75 hover:bg-secondary hover:text-secondary-foreground"

const overviewNav: NavItem[] = [
  { label: "Overview", href: "/admin" as Route, icon: LayoutDashboard },
]

const managementNav: NavItem[] = [
  { label: "Users", href: "/admin/users" as Route, icon: Users },
  {
    label: "Subscription Plans",
    href: "/admin/subscription-plans" as Route,
    icon: Tags,
  },
  { label: "Payments", href: "/admin/payments" as Route, icon: CreditCard },
]

const accountNav: NavItem[] = [
  { label: "Settings", href: "/admin/settings" as Route, icon: Settings },
]

function NavLink({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const isActive =
    pathname === item.href ||
    (item.href !== "/admin" && pathname.startsWith(item.href))
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        navItemBase,
        "px-3 py-2.5",
        isActive ? navItemActive : navItemIdle
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className="flex-1">{item.label}</span>
    </Link>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter()

  return (
    <div className="flex min-h-full flex-col p-4">
      <div className="mb-6 rounded-4xl border border-border bg-background p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-11 border-2 border-border">
            <AvatarFallback className="bg-secondary/10 text-sm font-semibold text-secondary">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">Admin User</p>
            <p className="truncate text-xs text-muted-foreground">
              admin@uhc.com
            </p>
          </div>
        </div>
        <div className="mt-3">
          <Badge
            variant="outline"
            className="rounded-full border-secondary/30 bg-secondary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-secondary uppercase"
          >
            Administrator
          </Badge>
        </div>
      </div>

      <nav className="flex-1 space-y-5">
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Overview
          </p>
          <ul className="space-y-0.5">
            {overviewNav.map((item) => (
              <li key={item.href}>
                <NavLink item={item} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Management
          </p>
          <ul className="space-y-0.5">
            {managementNav.map((item) => (
              <li key={item.href}>
                <NavLink item={item} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mt-4 border-t border-border pt-4">
        <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Account
        </p>
        <ul className="space-y-0.5">
          {accountNav.map((item) => (
            <li key={item.href}>
              <NavLink item={item} onNavigate={onNavigate} />
            </li>
          ))}
          <li>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start",
                navItemBase,
                "px-3 py-2.5",
                navItemIdle
              )}
              onClick={() => {
                onNavigate?.()
                router.push("/login")
              }}
            >
              <LogOut className="size-4 shrink-0" aria-hidden />
              Logout
            </Button>
          </li>
        </ul>
      </div>
    </div>
  )
}

type AdminSidebarProps = {
  mobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
}

export default function AdminSidebar({
  mobileOpen = false,
  onMobileOpenChange,
}: AdminSidebarProps) {
  return (
    <>
      <aside className="hidden w-[17.5rem] shrink-0 self-stretch lg:block">
        <div className="sticky top-3 flex max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-lg">
          <div className="thin-scrollbar flex-1 overflow-y-auto">
            <SidebarContent />
          </div>
        </div>
      </aside>

      {onMobileOpenChange ? (
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden",
            mobileOpen ? "block" : "hidden"
          )}
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => onMobileOpenChange(false)}
          />
          <aside className="thin-scrollbar relative flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto rounded-r-3xl border border-border/60 bg-muted shadow-xl">
            <SidebarContent onNavigate={() => onMobileOpenChange(false)} />
          </aside>
        </div>
      ) : null}
    </>
  )
}
