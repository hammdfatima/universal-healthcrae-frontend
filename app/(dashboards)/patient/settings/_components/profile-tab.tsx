"use client"

import { useEffect, useState } from "react"

import PatientProfileForm from "@/app/(dashboards)/patient/_components/patient-profile-form"
import {
  formValuesToProfile,
  getProfileFromStorage,
  initialProfile,
  type ProfileFormValues,
  profileToFormValues,
  saveProfileToStorage,
} from "@/app/(dashboards)/patient/_lib/settings"
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

export default function ProfileTab() {
  const { toastSuccess } = useToast()
  const [defaultValues, setDefaultValues] = useState<ProfileFormValues>(
    profileToFormValues(initialProfile)
  )
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    const profile = getProfileFromStorage()
    setDefaultValues(profileToFormValues(profile))
    setFormKey((key) => key + 1)
  }, [])

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <Typography as="h2" variant="h4">
        Profile
      </Typography>
      <Typography variant="muted" className="mt-1">
        Update your photo, personal details, and health profile information.
      </Typography>

      <div className="mt-6">
        <PatientProfileForm
          formKey={formKey}
          defaultValues={defaultValues}
          onSubmit={(values) => {
            const profile = formValuesToProfile(values)
            saveProfileToStorage(profile)
            setDefaultValues(profileToFormValues(profile))
            toastSuccess("Profile updated successfully.")
          }}
        />
      </div>
    </div>
  )
}
