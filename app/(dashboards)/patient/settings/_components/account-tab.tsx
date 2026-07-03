"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import {
  type AccountSettings,
  initialAccountSettings,
} from "@/app/(dashboards)/patient/_lib/settings"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import useToast from "@/hooks/use-toast"
import {
  PATIENT_SETTINGS_API,
  PATIENT_SETTINGS_QUERY_KEYS,
  type PatientSettings,
  type UpdateAccountPayload,
} from "@/lib/api/patient-settings"

export default function AccountTab() {
  const queryClient = useQueryClient()
  const { toastSuccess } = useToast()
  const [settings, setSettings] = useState<AccountSettings>(
    initialAccountSettings
  )

  const { data, isLoading, isError, error, refetch } =
    useFetch<PatientSettings>({
      path: PATIENT_SETTINGS_API.get,
      queryKey: PATIENT_SETTINGS_QUERY_KEYS.settings,
    })

  const { onRequest: updateAccount, isPending: isSaving } =
    useApi<UpdateAccountPayload>({
      key: "update-patient-account",
      method: "patch",
    })

  useEffect(() => {
    if (!data?.account) return
    setSettings(data.account)
  }, [data])

  function updateSettings(next: AccountSettings) {
    const previous = settings
    setSettings(next)

    updateAccount({
      path: PATIENT_SETTINGS_API.updateAccount,
      data: next,
      onSuccess: (updatedSettings) => {
        queryClient.setQueryData(
          PATIENT_SETTINGS_QUERY_KEYS.settings,
          updatedSettings
        )
      },
      onError: () => {
        setSettings(previous)
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
          {error?.message ?? "Failed to load account settings."}
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
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <Typography as="h2" variant="h4">
          Notifications
        </Typography>
        <Typography variant="muted" className="mt-1">
          Choose how you want to hear from Universal Health Charts.
        </Typography>

        <div className="mt-6 space-y-4">
          <label
            htmlFor="email-notifications"
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
          >
            <Checkbox
              id="email-notifications"
              checked={settings.emailNotifications}
              className="mt-0.5"
              disabled={isSaving}
              onCheckedChange={(checked) =>
                updateSettings({
                  ...settings,
                  emailNotifications: checked === true,
                })
              }
            />
            <span>
              <Typography variant="small" className="font-medium">
                Email notifications
              </Typography>
              <Typography variant="muted" className="mt-0.5 text-sm">
                Receive updates about appointments, records, and account
                activity.
              </Typography>
            </span>
          </label>

          <label
            htmlFor="marketing-emails"
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
          >
            <Checkbox
              id="marketing-emails"
              checked={settings.marketingEmails}
              className="mt-0.5"
              disabled={isSaving}
              onCheckedChange={(checked) =>
                updateSettings({
                  ...settings,
                  marketingEmails: checked === true,
                })
              }
            />
            <span>
              <Typography variant="small" className="font-medium">
                Product updates and tips
              </Typography>
              <Typography variant="muted" className="mt-0.5 text-sm">
                Get occasional emails about new features and health record tips.
              </Typography>
            </span>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <Typography as="h2" variant="h4">
          Data & account
        </Typography>
        <Typography variant="muted" className="mt-1">
          Export your data or permanently close your account.
        </Typography>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              toastSuccess("Your data export will be emailed shortly.")
            }
          >
            Export My Data
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action permanently removes your profile and health
                  records. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() =>
                    toastSuccess(
                      "Account deletion request received. Our team will contact you."
                    )
                  }
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
