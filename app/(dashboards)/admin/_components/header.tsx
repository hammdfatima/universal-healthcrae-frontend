"use client"

import { Menu } from "lucide-react"
import Image from "next/image"

import AdminNotificationDropdown from "@/app/(dashboards)/admin/_components/notification-dropdown"
import DashboardSearch from "@/components/dashboard-search"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AdminHeaderProps = {
  onMenuClick?: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="shrink-0 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm sm:px-5">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {onMenuClick ? (
            <Button
              type="button"
              variant="ghost"
              className="size-10 shrink-0 p-0 lg:hidden"
              aria-label="Open menu"
              onClick={onMenuClick}
            >
              <Menu className="size-5" />
            </Button>
          ) : null}

          <Image
            src="/logo.jpeg"
            alt="Universal Health Charts"
            width={200}
            height={50}
            className="h-8 w-auto shrink-0 sm:h-9"
            quality={100}
          />

          <DashboardSearch
            portal="admin"
            placeholder="Search users, plans, payments..."
            className="md:max-w-md lg:max-w-xl"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <AdminNotificationDropdown />
          <span
            className={cn(
              "hidden rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold tracking-wide text-secondary uppercase sm:inline"
            )}
          >
            Admin
          </span>
        </div>
      </div>
    </header>
  )
}
