"use client"

import { Menu, Search } from "lucide-react"
import Image from "next/image"

import NotificationDropdown from "@/app/(dashboards)/patient/_components/notification-dropdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

          <div className="relative hidden min-w-0 flex-1 md:block md:max-w-md lg:max-w-xl">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Search medications, doctors, documents..."
              className="h-11 bg-muted/40 pl-11"
              aria-label="Search dashboard"
            />
          </div>
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
    <Image
      src="/logo.jpeg"
      alt="Universal Health Charts"
      width={200}
      height={50}
      className={cn("h-8 w-auto sm:h-9", className)}
      quality={100}
    />
  )
}
