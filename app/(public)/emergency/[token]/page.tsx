"use client"

import { AlertTriangle, Eye, EyeOff } from "lucide-react"
import { use, useState } from "react"

import EmergencyRecordsView from "@/app/(dashboards)/patient/_components/emergency-records-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  EMERGENCY_ACCESS_API,
  EMERGENCY_ACCESS_QUERY_KEYS,
  type PublicEmergencyChallenge,
  type PublicEmergencyRecords,
} from "@/lib/api/emergency-access"

type EmergencyAccessPageProps = {
  params: Promise<{ token: string }>
}

export default function EmergencyAccessPage({
  params,
}: EmergencyAccessPageProps) {
  const { token } = use(params)
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [records, setRecords] = useState<PublicEmergencyRecords | null>(null)

  const challengeQuery = useFetch<PublicEmergencyChallenge>({
    path: EMERGENCY_ACCESS_API.publicChallenge(token),
    queryKey: EMERGENCY_ACCESS_QUERY_KEYS.publicChallenge(token),
    retry: false,
    enabled: !records,
  })

  const unlockApi = useApi<{ pin: string }>({
    key: "unlock-emergency-access",
    method: "post",
    showSuccessToast: false,
  })

  function handleUnlock(event: React.FormEvent) {
    event.preventDefault()

    unlockApi.onRequest<PublicEmergencyRecords>({
      path: EMERGENCY_ACCESS_API.unlock(token),
      data: { pin },
      onSuccess: (data) => {
        setRecords(data)
      },
    })
  }

  if (records) {
    return (
      <div className="mx-auto max-w-4xl px-5 pb-24 pt-8 sm:px-6 sm:pb-10 sm:pt-10">
        <div className="mb-8">
          <Typography variant="h2">Emergency Medical Records</Typography>
          <Typography variant="muted" className="mt-2">
            Authorized emergency access for {records.patientName}.
          </Typography>
        </div>
        <EmergencyRecordsView records={records} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-5 pb-24 pt-8 sm:px-6 sm:pb-10 sm:pt-10">
      <div className="mb-8 text-center">
        <Typography variant="h2">Emergency Access</Typography>
        {challengeQuery.isLoading ? null : challengeQuery.isError ||
          !challengeQuery.data ? (
          <Typography variant="muted" className="mt-2">
            Unable to load emergency access challenge.
          </Typography>
        ) : (
          <Typography variant="muted" className="mt-2">
            Enter the patient PIN to unlock records for{" "}
            {challengeQuery.data.patientInitials}. Access expires{" "}
            {new Date(challengeQuery.data.expiresAt).toLocaleString()}.
          </Typography>
        )}
      </div>

      {challengeQuery.isLoading ? (
        <Loader
          variant="fetch"
          label="Verifying emergency access link..."
          className="min-h-[40vh] py-16"
        />
      ) : challengeQuery.isError || !challengeQuery.data ? (
        <div className="rounded-2xl border border-border/60 bg-muted/20 px-6 py-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-7 text-destructive" aria-hidden />
          </div>
          <Typography variant="h3" className="mt-6">
            Emergency access unavailable
          </Typography>
          <Typography variant="muted" className="mt-2">
            This link is invalid, expired, or has been revoked by the patient.
          </Typography>
        </div>
      ) : (
        <form
          onSubmit={handleUnlock}
          className="space-y-4 rounded-2xl border border-border/60 bg-muted/10 p-6"
        >
          <div className="space-y-2">
            <label htmlFor="emergency-pin" className="text-sm font-medium">
              Emergency PIN
            </label>
            <div className="relative">
              <Input
                id="emergency-pin"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{4}"
                maxLength={4}
                placeholder="4-digit PIN"
                className="pr-11"
                value={pin}
                onChange={(event) =>
                  setPin(event.target.value.replace(/\D/g, "").slice(0, 4))
                }
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
                onClick={() => setShowPin((visible) => !visible)}
              >
                {showPin ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={pin.length !== 4 || unlockApi.isPending}
          >
            {unlockApi.isPending ? "Unlocking..." : "Unlock records"}
          </Button>
        </form>
      )}
    </div>
  )
}
