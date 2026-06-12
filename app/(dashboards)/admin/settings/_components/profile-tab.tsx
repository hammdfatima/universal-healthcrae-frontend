"use client"

import { useEffect, useState } from "react"

import {
  type AdminProfileFormValues,
  adminProfileSchema,
  getAdminProfileFromStorage,
  initialAdminProfile,
  saveAdminProfileToStorage,
} from "@/app/(dashboards)/admin/_lib/settings"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

export default function AdminProfileTab() {
  const { toastSuccess } = useToast()
  const [defaultValues, setDefaultValues] =
    useState<AdminProfileFormValues>(initialAdminProfile)
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    setDefaultValues(getAdminProfileFromStorage())
    setFormKey((key) => key + 1)
  }, [])

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
          onSubmit={(values) => {
            const profile = {
              name: values.name.trim(),
              email: values.email.trim(),
              phone: values.phone.trim(),
            }
            saveAdminProfileToStorage(profile)
            setDefaultValues(profile)
            toastSuccess("Profile updated successfully.")
          }}
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
                  <Button type="submit">Save Profile</Button>
                </div>
              </>
            )
          }}
        </FormModified>
      </div>
    </div>
  )
}
