"use client"

import { useQueryClient } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import type { Route } from "next"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { downloadPatientDataExport } from "@/app/(dashboards)/patient/_lib/download-patient-data"
import {
  type AccountSettings,
  initialAccountSettings,
} from "@/app/(dashboards)/patient/_lib/settings"
import StepUpPasswordDialog from "@/components/auth/step-up-password-dialog"
import {
  AlertDialog,
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
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import useToast from "@/hooks/use-toast"
import {
  type AuthSessionsList,
  type DeleteAccountPayload,
  PATIENT_SETTINGS_API,
  PATIENT_SETTINGS_QUERY_KEYS,
  type PatientSettings,
  revokeAuthSession,
  revokeOtherAuthSessions,
  type UpdateAccountPayload,
} from "@/lib/api/patient-settings"

const DELETE_CONFIRMATION_TEXT = "DELETE"

type StepUpAction = "export" | "delete"

export default function AccountTab() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()
  const [settings, setSettings] = useState<AccountSettings>(
    initialAccountSettings
  )
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [stepUpAction, setStepUpAction] = useState<StepUpAction | null>(null)
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(
    null
  )
  const [isRevokingOthers, setIsRevokingOthers] = useState(false)

  const { data, isLoading, isError, error, refetch } =
    useFetch<PatientSettings>({
      path: PATIENT_SETTINGS_API.get,
      queryKey: PATIENT_SETTINGS_QUERY_KEYS.settings,
    })

  const sessionsQuery = useFetch<AuthSessionsList>({
    path: PATIENT_SETTINGS_API.sessions,
    queryKey: PATIENT_SETTINGS_QUERY_KEYS.sessions,
  })

  const { onRequest: updateAccount, isPending: isSaving } =
    useApi<UpdateAccountPayload>({
      key: "update-patient-account",
      method: "patch",
    })

  const { onRequest: deleteAccount, isPending: isDeleting } =
    useApi<DeleteAccountPayload>({
      key: "delete-patient-account",
      method: "post",
      showSuccessToast: false,
    })

  useEffect(() => {
    if (!data?.account) return
    setSettings(data.account)
  }, [data])

  useEffect(() => {
    if (!deleteOpen) {
      setDeleteConfirmation("")
    }
  }, [deleteOpen])

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

  async function handleStepUpVerified(token: string) {
    const action = stepUpAction
    setStepUpAction(null)

    if (action === "export") {
      setIsExporting(true)
      try {
        await downloadPatientDataExport(token)
        toastSuccess("Your health data has been downloaded.")
      } catch {
        toastError("Failed to export your data. Please try again.")
      } finally {
        setIsExporting(false)
      }
      return
    }

    if (action === "delete") {
      deleteAccount({
        path: PATIENT_SETTINGS_API.deleteAccount,
        data: { confirmation: DELETE_CONFIRMATION_TEXT, stepUpToken: token },
        onSuccess: () => {
          setDeleteOpen(false)
          toastSuccess("Your account has been permanently deleted.")
          logout("/" as Route)
          router.replace("/" as Route)
        },
      })
    }
  }

  function handleExportClick() {
    setStepUpAction("export")
  }

  function handleDeleteAccount() {
    if (deleteConfirmation !== DELETE_CONFIRMATION_TEXT) {
      return
    }

    setDeleteOpen(false)
    setStepUpAction("delete")
  }

  async function handleRevokeSession(sessionId: string) {
    setRevokingSessionId(sessionId)
    try {
      await revokeAuthSession(sessionId)
      toastSuccess("Session revoked.")
      await sessionsQuery.refetch()
    } catch {
      toastError("Failed to revoke that session. Please try again.")
    } finally {
      setRevokingSessionId(null)
    }
  }

  async function handleRevokeOtherSessions() {
    if (!sessionsQuery.data) return

    setIsRevokingOthers(true)
    try {
      await revokeOtherAuthSessions(sessionsQuery.data.sessions)
      toastSuccess("Signed out of all other devices.")
      await sessionsQuery.refetch()
    } catch {
      toastError("Failed to sign out other devices. Please try again.")
    } finally {
      setIsRevokingOthers(false)
    }
  }

  const canDeleteAccount = deleteConfirmation === DELETE_CONFIRMATION_TEXT
  const sessions = sessionsQuery.data?.sessions ?? []
  const otherSessionsCount = sessions.filter(
    (session) => !session.isCurrent
  ).length

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
                Receive email updates about sign-ins, billing, support replies,
                and account activity. Verification and password reset codes are
                always sent.
              </Typography>
            </span>
          </label>

          <label
            htmlFor="in-app-notifications"
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
          >
            <Checkbox
              id="in-app-notifications"
              checked={settings.inAppNotifications}
              className="mt-0.5"
              disabled={isSaving}
              onCheckedChange={(checked) =>
                updateSettings({
                  ...settings,
                  inAppNotifications: checked === true,
                })
              }
            />
            <span>
              <Typography variant="small" className="font-medium">
                In-app notifications
              </Typography>
              <Typography variant="muted" className="mt-0.5 text-sm">
                Receive alerts in your dashboard about sign-ins, medications,
                vaccinations, lab results, imaging, and care providers.
              </Typography>
            </span>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Typography as="h2" variant="h4">
              Active Sessions
            </Typography>
            <Typography variant="muted" className="mt-1">
              Devices currently signed in to your account (HIPAA §2.5).
            </Typography>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={isRevokingOthers || otherSessionsCount === 0}
            onClick={() => void handleRevokeOtherSessions()}
          >
            {isRevokingOthers ? (
              <Loader variant="button" />
            ) : (
              "Log out other devices"
            )}
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          {sessionsQuery.isLoading ? (
            <div className="flex justify-center py-6">
              <Loader variant="fetch" label="Loading sessions..." />
            </div>
          ) : sessionsQuery.isError ? (
            <Typography variant="muted" className="text-center text-sm">
              Could not load your active sessions.
            </Typography>
          ) : sessions.length === 0 ? (
            <Typography variant="muted" className="text-center text-sm">
              No active sessions found.
            </Typography>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <Typography
                    variant="small"
                    className="flex flex-wrap items-center gap-2 font-medium"
                  >
                    {session.userAgent ?? "Unknown device"}
                    {session.isCurrent ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        This device
                      </span>
                    ) : null}
                  </Typography>
                  <Typography
                    variant="muted"
                    className="mt-0.5 text-xs break-all"
                  >
                    {session.ip ?? "Unknown IP"} · Last active{" "}
                    {formatDistanceToNow(new Date(session.lastSeenAt), {
                      addSuffix: true,
                    })}
                  </Typography>
                </div>

                {!session.isCurrent ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 self-start text-destructive hover:text-destructive"
                    disabled={revokingSessionId === session.sessionId}
                    onClick={() => void handleRevokeSession(session.sessionId)}
                  >
                    {revokingSessionId === session.sessionId ? (
                      <Loader variant="button" />
                    ) : (
                      "Revoke"
                    )}
                  </Button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <Typography as="h2" variant="h4">
          Data & account
        </Typography>
        <Typography variant="muted" className="mt-1">
          Export your data or permanently close your account. Both actions
          require re-entering your password (HIPAA §2.4).
        </Typography>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={isExporting}
            onClick={handleExportClick}
          >
            {isExporting ? <Loader variant="button" /> : "Export My Data"}
          </Button>

          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes your profile, health records, and any
                  family member accounts linked to your plan. This cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-2 px-1">
                <Typography variant="small" className="font-medium">
                  Type{" "}
                  <span className="font-mono">{DELETE_CONFIRMATION_TEXT}</span>{" "}
                  to confirm
                </Typography>
                <Input
                  value={deleteConfirmation}
                  onChange={(event) =>
                    setDeleteConfirmation(event.target.value)
                  }
                  placeholder={DELETE_CONFIRMATION_TEXT}
                  autoComplete="off"
                  disabled={isDeleting}
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={!canDeleteAccount || isDeleting}
                  onClick={handleDeleteAccount}
                >
                  {isDeleting ? (
                    <Loader variant="button" color="white" />
                  ) : (
                    "Delete Account"
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <StepUpPasswordDialog
        open={stepUpAction !== null}
        onOpenChange={(open) => {
          if (!open) setStepUpAction(null)
        }}
        title={
          stepUpAction === "delete"
            ? "Confirm account deletion"
            : "Confirm data export"
        }
        description={
          stepUpAction === "delete"
            ? "Re-enter your password to permanently delete your account and health records."
            : "Re-enter your password to download a copy of your health records."
        }
        onVerified={(token) => void handleStepUpVerified(token)}
      />
    </div>
  )
}
