"use client"

import { Camera, X } from "lucide-react"
import { useRef } from "react"

import { getProviderInitials } from "@/app/(dashboards)/patient/_lib/providers"
import {
  getProfileDisplayName,
  type PatientProfile,
} from "@/app/(dashboards)/patient/_lib/settings"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

type ProfileImageFieldProps = {
  image?: string
  profile: Pick<PatientProfile, "firstName" | "lastName">
  onChange: (image: string) => void
  disabled?: boolean
}

export default function ProfileImageField({
  image,
  profile,
  onChange,
  disabled,
}: ProfileImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const displayName = getProfileDisplayName(profile)
  const initials = getProviderInitials(displayName)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
    event.target.value = ""
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        disabled={disabled}
        className="sr-only"
        onChange={handleFileChange}
      />

      <div className="relative">
        <Avatar className="size-24 border-4 border-background shadow-md ring-2 ring-primary/15">
          {image ? <AvatarImage src={image} alt={displayName} /> : null}
          <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "absolute right-0 bottom-0 flex size-9 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105",
            disabled && "pointer-events-none opacity-50"
          )}
          aria-label="Upload profile photo"
        >
          <Camera className="size-4" aria-hidden />
        </button>
      </div>

      <div className="text-center sm:text-left">
        <Typography variant="small" className="font-semibold">
          Profile Photo
        </Typography>
        <Typography variant="muted" className="mt-1 text-sm">
          Upload a clear photo for your health profile.
        </Typography>
        {image ? (
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button
              type="button"
              variant="ghost"
              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={disabled}
              onClick={() => onChange("")}
            >
              <X className="size-4" aria-hidden />
              Remove
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
