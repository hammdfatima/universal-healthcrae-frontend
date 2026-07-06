"use client"

import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  type ChangePasswordFormValues,
  changePasswordSchema,
} from "@/app/(dashboards)/patient/_lib/settings"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import {
  type ChangePasswordPayload,
  PATIENT_SETTINGS_API,
} from "@/lib/api/patient-settings"
import { updateAuthUser } from "@/lib/auth/session"

const defaultValues: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
}

type ChangePasswordTabProps = {
  required?: boolean
}

export default function ChangePasswordTab({
  required = false,
}: ChangePasswordTabProps) {
  const router = useRouter()
  const { refreshSession } = useAuth()
  const [formKey, setFormKey] = useState(0)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { onRequest: changePassword, isPending: isSaving } =
    useApi<ChangePasswordPayload>({
      key: "change-patient-password",
      method: "post",
    })

  function handleSubmit(values: ChangePasswordFormValues) {
    changePassword({
      path: PATIENT_SETTINGS_API.changePassword,
      data: {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      onSuccess: () => {
        updateAuthUser({ mustChangePassword: false })
        refreshSession()
        setFormKey((key) => key + 1)
        setShowCurrentPassword(false)
        setShowNewPassword(false)
        setShowConfirmPassword(false)

        if (required) {
          router.replace("/patient")
        }
      },
    })
  }

  return (
    <div
      className={
        required
          ? ""
          : "rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
      }
    >
      {required ? null : (
        <>
          <Typography as="h2" variant="h4">
            Change Password
          </Typography>
          <Typography variant="muted" className="mt-1">
            Use a strong password with at least 8 characters.
          </Typography>
        </>
      )}

      <div className={required ? "" : "mt-6"}>
        <FormModified
          key={formKey}
          schema={changePasswordSchema}
          defaultValues={defaultValues}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={handleSubmit}
        >
          {({ components }) => {
            const { Field } = components

            return (
              <>
                <Field
                  name="currentPassword"
                  label={required ? "Temporary Password" : "Current Password"}
                >
                  {(field) => (
                    <div className="relative">
                      <Input
                        {...field}
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder={
                          required
                            ? "Enter the password from your email"
                            : "Enter current password"
                        }
                        autoComplete="current-password"
                        className="pr-12"
                        disabled={isSaving}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
                        aria-label={
                          showCurrentPassword
                            ? "Hide current password"
                            : "Show current password"
                        }
                        onClick={() => setShowCurrentPassword((open) => !open)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="size-4" aria-hidden />
                        ) : (
                          <Eye className="size-4" aria-hidden />
                        )}
                      </Button>
                    </div>
                  )}
                </Field>

                <Field name="newPassword" label="New Password">
                  {(field) => (
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        className="pr-12"
                        disabled={isSaving}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
                        aria-label={
                          showNewPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                        onClick={() => setShowNewPassword((open) => !open)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="size-4" aria-hidden />
                        ) : (
                          <Eye className="size-4" aria-hidden />
                        )}
                      </Button>
                    </div>
                  )}
                </Field>

                <Field name="confirmPassword" label="Confirm New Password">
                  {(field) => (
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        className="pr-12"
                        disabled={isSaving}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        onClick={() => setShowConfirmPassword((open) => !open)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" aria-hidden />
                        ) : (
                          <Eye className="size-4" aria-hidden />
                        )}
                      </Button>
                    </div>
                  )}
                </Field>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <Loader variant="button" />
                    ) : required ? (
                      "Save New Password"
                    ) : (
                      "Update Password"
                    )}
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
