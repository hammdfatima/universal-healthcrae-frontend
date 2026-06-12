"use client"

import { UserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import PatientProfileForm from "@/app/(dashboards)/patient/_components/patient-profile-form"
import {
  formValuesToProfile,
  getProfileFromStorage,
  initialProfile,
  isOnboardingComplete,
  markOnboardingComplete,
  type ProfileFormValues,
  profileToFormValues,
  saveProfileToStorage,
} from "@/app/(dashboards)/patient/_lib/settings"
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

export default function OnboardingPatientContent() {
  const router = useRouter()
  const { toastSuccess } = useToast()
  const [defaultValues, setDefaultValues] = useState<ProfileFormValues>(
    profileToFormValues(initialProfile)
  )
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    if (isOnboardingComplete()) {
      router.replace("/patient")
      return
    }

    const profile = getProfileFromStorage()
    setDefaultValues(profileToFormValues(profile))
    setFormKey((key) => key + 1)
  }, [router])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
        <div className="bg-gradient-to-br from-secondary via-secondary to-primary px-6 py-8 text-secondary-foreground sm:px-8">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <UserRound className="size-6" aria-hidden />
            </span>
            <div>
              <Typography
                as="h1"
                variant="h3"
                color="inherit"
                className="text-secondary-foreground"
              >
                Complete your profile
              </Typography>
              <Typography
                variant="muted"
                color="inherit"
                className="mt-2 max-w-2xl text-secondary-foreground/85"
              >
                Welcome to Universal Health Charts. Before you access your
                medical vault, please add your profile details so your health
                records are accurate and ready for emergency access.
              </Typography>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <div className="mt-6">
            <PatientProfileForm
              formKey={formKey}
              defaultValues={defaultValues}
              submitLabel="Complete Profile & Continue"
              onSubmit={(values) => {
                const profile = formValuesToProfile(values)
                saveProfileToStorage(profile)
                markOnboardingComplete()
                toastSuccess("Profile saved. Welcome to your dashboard!")
                router.push("/patient")
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
