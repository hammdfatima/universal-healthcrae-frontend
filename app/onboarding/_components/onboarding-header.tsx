"use client"

import { LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Typography } from "@/components/ui/typography"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import {
  PATIENT_PROFILE_API,
  PATIENT_PROFILE_QUERY_KEYS,
  type PatientProfileResponse,
} from "@/lib/api/patient-profile"
import { getUserDisplayName, getUserInitials } from "@/lib/auth/utils"

export default function OnboardingHeader() {
  const { user, logout } = useAuth()
  const { data: profile } = useFetch<PatientProfileResponse>({
    path: PATIENT_PROFILE_API.get,
    queryKey: PATIENT_PROFILE_QUERY_KEYS.profile,
    enabled: Boolean(user),
  })

  if (!user) {
    return null
  }

  const displayName = getUserDisplayName(user)
  const initials = getUserInitials(user)
  const profileImage = profile?.profileImage ?? user.profileImage ?? null

  return (
    <header className="shrink-0 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm sm:px-5">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Universal Health Charts"
            width={200}
            height={50}
            className="h-8 w-auto sm:h-9"
            quality={100}
            priority
          />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="size-10 rounded-full p-0"
              aria-label="Account menu"
            >
              <Avatar className="size-9 border border-border/60">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt={displayName} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <Typography variant="small" className="font-semibold">
                {displayName}
              </Typography>
              <Typography variant="muted" className="truncate text-xs">
                {user.email}
              </Typography>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={() => logout()}
            >
              <LogOut className="size-4" aria-hidden />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
