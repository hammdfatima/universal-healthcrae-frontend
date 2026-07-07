"use client"

import { Menu } from "lucide-react"
import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"

import NotificationDropdown from "@/app/(dashboards)/patient/_components/notification-dropdown"
import DashboardSearch from "@/components/dashboard-search"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PatientHeaderProps = {
  onMenuClick?: () => void
}

export default function PatientHeader({ onMenuClick }: PatientHeaderProps) {
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

          <LinkLogo className="shrink-0" />

          <DashboardSearch
            portal="patient"
            placeholder="Search medications, doctors, documents..."
            className="md:max-w-md lg:max-w-xl"
          />
        </div>

        <div className="flex shrink-0 items-center">
          <NotificationDropdown />
        </div>
      </div>
    </header>
  )
}

function LinkLogo({ className }: { className?: string }) {
  return (
    <Link href={"/" as Route} className={cn("shrink-0", className)}>
      <Image
        src="/logo.jpeg"
        alt="Universal Health Charts"
        width={200}
        height={50}
        className="h-8 w-auto sm:h-9"
        quality={100}
      />
    </Link>
  )
}
