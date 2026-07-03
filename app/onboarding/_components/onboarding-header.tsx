"use client"

import { LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import { getProviderInitials } from "@/app/(dashboards)/patient/_lib/providers"
import {
  getProfileDisplayName,
  getProfileFromStorage,
} from "@/app/(dashboards)/patient/_lib/settings"
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
import { getUserDisplayName, getUserInitials } from "@/lib/auth/utils"

export default function OnboardingHeader() {
  const { user, logout } = useAuth()
  const [displayName, setDisplayName] = useState("User")
  const [email, setEmail] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [initials, setInitials] = useState("U")

  useEffect(() => {
    const profile = getProfileFromStorage()
    const profileName = getProfileDisplayName(profile)
    const authName = user ? getUserDisplayName(user) : ""

    setDisplayName(profileName || authName || "User")
    setEmail(user?.email || profile.email)
    setProfileImage(profile.profileImage)
    setInitials(
      user
        ? getUserInitials(user)
        : getProviderInitials(profileName || authName || "User")
    )
  }, [user])

  return (
    <header className="shrink-0 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm sm:px-5">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.jpeg"
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
              {email ? (
                <Typography variant="muted" className="truncate text-xs">
                  {email}
                </Typography>
              ) : null}
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
