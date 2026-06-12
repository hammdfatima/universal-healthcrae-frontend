"use client"

import { useEffect, useState } from "react"

import {
  type AccountSettings,
  getAccountSettingsFromStorage,
  initialAccountSettings,
  saveAccountSettingsToStorage,
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
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

export default function AccountTab() {
  const { toastSuccess } = useToast()
  const [settings, setSettings] = useState<AccountSettings>(
    initialAccountSettings
  )

  useEffect(() => {
    setSettings(getAccountSettingsFromStorage())
  }, [])

  function updateSettings(next: AccountSettings) {
    setSettings(next)
    saveAccountSettingsToStorage(next)
    toastSuccess("Account preferences updated.")
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
