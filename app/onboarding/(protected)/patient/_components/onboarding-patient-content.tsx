"use client"

import { useQueryClient } from "@tanstack/react-query"
import { UserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import PatientProfileForm from "@/app/(dashboards)/patient/_components/patient-profile-form"
import type { ProfileFormValues } from "@/app/(dashboards)/patient/_lib/settings"
import { saveProfileToStorage } from "@/app/(dashboards)/patient/_lib/settings"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import {
  apiProfileToPatientProfile,
  type CompleteOnboardingPayload,
  formValuesToOnboardingPayload,
  PATIENT_PROFILE_API,
  PATIENT_PROFILE_QUERY_KEYS,
  type PatientProfileResponse,
  profileResponseToFormValues,
} from "@/lib/api/patient-profile"
import { getAuthUser, setAuthSession } from "@/lib/auth/session"

function getInitialFormValues(
  user: ReturnType<typeof useAuth>["user"]
): ProfileFormValues {
  return {
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: "",
    profileImage: "",
    bloodGroup: "",
    gender: "",
    address: "",
  }
}

export default function OnboardingPatientContent() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [defaultValues, setDefaultValues] = useState<ProfileFormValues>(() =>
    getInitialFormValues(user)
  )
  const [formKey, setFormKey] = useState(0)
  // Auth session refresh replaces the `user` object periodically; only hydrate
  // the form once so in-progress edits are not wiped by a remount.
  const hasHydratedFormRef = useRef(false)

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFetch<PatientProfileResponse>({
    path: PATIENT_PROFILE_API.get,
    queryKey: PATIENT_PROFILE_QUERY_KEYS.profile,
    enabled: Boolean(user),
  })

  const { onRequest: completeOnboarding, isPending } =
    useApi<CompleteOnboardingPayload>({
      key: "complete-onboarding",
      method: "patch",
    })

  useEffect(() => {
    // Only redirect on a successful profile load. Cached data during an error
    // must not bounce back to /patient (that caused a redirect loop).
    if (!isLoading && !isError && profile?.onboardingCompleted) {
      router.replace("/patient")
    }
  }, [profile, isLoading, isError, router])

  useEffect(() => {
    if (!profile || hasHydratedFormRef.current) return

    hasHydratedFormRef.current = true

    if (
      profile.firstName ||
      profile.lastName ||
      profile.phone ||
      profile.profileImage
    ) {
      setDefaultValues(profileResponseToFormValues(profile))
    } else if (user) {
      setDefaultValues(getInitialFormValues(user))
    }

    setFormKey((key) => key + 1)
  }, [profile, user])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
          <Loader
            variant="fetch"
            label="Loading your profile..."
            className="py-24"
          />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card px-6 py-12 text-center shadow-sm">
          <Typography variant="muted">
            {error?.message ?? "Failed to load your profile."}
          </Typography>
          <button
            type="button"
            className="mt-4 text-sm font-medium text-primary hover:underline"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

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
              emailReadOnly
              isSubmitting={isPending}
              submitLabel="Complete Profile & Continue"
              onSubmit={(values) => {
                completeOnboarding({
                  path: PATIENT_PROFILE_API.completeOnboarding,
                  data: formValuesToOnboardingPayload(values),
                  onSuccess: (updatedProfile) => {
                    queryClient.setQueryData(
                      PATIENT_PROFILE_QUERY_KEYS.profile,
                      updatedProfile
                    )

                    const savedProfile =
                      apiProfileToPatientProfile(updatedProfile)
                    saveProfileToStorage(savedProfile)

                    const currentUser = getAuthUser()

                    if (currentUser) {
                      setAuthSession({
                        ...currentUser,
                        firstName: updatedProfile.firstName,
                        lastName: updatedProfile.lastName,
                        name: `${updatedProfile.firstName ?? ""} ${updatedProfile.lastName ?? ""}`.trim(),
                      })
                    }

                    router.push("/onboarding/subscription")
                  },
                })
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
