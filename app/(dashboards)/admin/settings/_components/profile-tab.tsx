"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import {
  type AdminProfile,
  type AdminProfileFormValues,
  type AdminProfilePayload,
  adminProfileSchema,
  toProfileFormValues,
} from "@/app/(dashboards)/admin/_lib/settings"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  ADMIN_PROFILE_API,
  ADMIN_PROFILE_QUERY_KEYS,
} from "@/lib/api/admin-profile"
import { getAuthUser, setAuthSession } from "@/lib/auth/session"

export default function AdminProfileTab() {
  const queryClient = useQueryClient()
  const [defaultValues, setDefaultValues] = useState<AdminProfileFormValues>({
    name: "",
    email: "",
    phone: "",
  })
  const [formKey, setFormKey] = useState(0)

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFetch<AdminProfile>({
    path: ADMIN_PROFILE_API.get,
    queryKey: ADMIN_PROFILE_QUERY_KEYS.profile,
  })

  const { onRequest: updateProfile, isPending: isSaving } =
    useApi<AdminProfilePayload>({
      key: "update-admin-profile",
      method: "patch",
    })

  useEffect(() => {
    if (!profile) return

    setDefaultValues(toProfileFormValues(profile))
    setFormKey((key) => key + 1)
  }, [profile])

  function handleSubmit(values: AdminProfileFormValues) {
    const payload: AdminProfilePayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    }

    updateProfile({
      path: ADMIN_PROFILE_API.update,
      data: payload,
      onSuccess: (updatedProfile) => {
        queryClient.setQueryData(
          ADMIN_PROFILE_QUERY_KEYS.profile,
          updatedProfile
        )

        const currentUser = getAuthUser()

        if (currentUser) {
          setAuthSession({
            ...currentUser,
            email: updatedProfile.email,
            name: updatedProfile.name,
          })
        }

        setDefaultValues(toProfileFormValues(updatedProfile))
        setFormKey((key) => key + 1)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <Loader variant="fetch" label="Loading profile..." className="py-16" />
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
          <Button
            type="button"
            variant="outline"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            {isFetching ? <Loader variant="button" /> : "Try again"}
          </Button>
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
        Update your admin account contact information.
      </Typography>

      <div className="mt-6">
        <FormModified
          key={formKey}
          schema={adminProfileSchema}
          defaultValues={defaultValues}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={handleSubmit}
        >
          {({ components }) => {
            const { Input: FormInput } = components

            return (
              <>
                <FormInput
                  name="name"
                  label="Name"
                  placeholder="Your full name"
                />
                <FormInput
                  name="email"
                  label="Email"
                  placeholder="Email address"
                  type="email"
                />
                <FormInput
                  name="phone"
                  label="Phone"
                  placeholder="Phone number"
                  type="tel"
                />

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader variant="button" /> : "Save Profile"}
                  </Button>
                </div>
              </>
            )
          }}
        </FormModified>
      </div>
    </div>
  )
}
