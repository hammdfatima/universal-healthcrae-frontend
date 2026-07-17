"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import PatientProfileForm from "@/app/(dashboards)/patient/_components/patient-profile-form"
import type { ProfileFormValues } from "@/app/(dashboards)/patient/_lib/settings"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  formValuesToOnboardingPayload,
  profileResponseToFormValues,
} from "@/lib/api/patient-profile"
import {
  PATIENT_SETTINGS_API,
  PATIENT_SETTINGS_QUERY_KEYS,
  type PatientSettings,
  type UpdateProfilePayload,
} from "@/lib/api/patient-settings"
import { getAuthUser, setAuthSession } from "@/lib/auth/session"

export default function ProfileTab() {
  const queryClient = useQueryClient()
  const [defaultValues, setDefaultValues] = useState<ProfileFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImage: "",
    bloodGroup: "",
    gender: "",
    address: "",
  })
  const [formKey, setFormKey] = useState(0)

  const {
    data: settings,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFetch<PatientSettings>({
    path: PATIENT_SETTINGS_API.get,
    queryKey: PATIENT_SETTINGS_QUERY_KEYS.settings,
  })

  const { onRequest: updateProfile, isPending: isSaving } =
    useApi<UpdateProfilePayload>({
      key: "update-patient-profile",
      method: "patch",
    })

  useEffect(() => {
    if (!settings?.profile) return

    setDefaultValues(profileResponseToFormValues(settings.profile))
    setFormKey((key) => key + 1)
  }, [settings])

  function handleSubmit(values: ProfileFormValues) {
    const payload = formValuesToOnboardingPayload(values)

    updateProfile({
      path: PATIENT_SETTINGS_API.updateProfile,
      data: payload,
      onSuccess: (updatedSettings) => {
        queryClient.setQueryData(
          PATIENT_SETTINGS_QUERY_KEYS.settings,
          updatedSettings
        )

        const currentUser = getAuthUser()

        if (currentUser && updatedSettings.profile) {
          const { firstName, lastName, profileImage } = updatedSettings.profile

          setAuthSession({
            ...currentUser,
            name:
              [firstName, lastName].filter(Boolean).join(" ").trim() ||
              currentUser.name,
            profileImage: profileImage ?? currentUser.profileImage,
          })
        }

        setDefaultValues(profileResponseToFormValues(updatedSettings.profile))
        setFormKey((key) => key + 1)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <Loader />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <Typography variant="muted" className="text-center">
          {error?.message ?? "Failed to load profile."}
        </Typography>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="text-sm text-primary underline"
            onClick={() => refetch()}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

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
          emailReadOnly
          isSubmitting={isSaving || isFetching}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
