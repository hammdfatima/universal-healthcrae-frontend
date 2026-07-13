"use client"

import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import QRCode from "qrcode"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import { AUTH_API } from "@/lib/auth/constants"
import { updateAuthUser } from "@/lib/auth/session"
import type { MfaSetupResponse, MfaStatusResponse } from "@/lib/auth/types"

const OTP_SLOTS = [0, 1, 2, 3, 4, 5] as const

export default function AuthenticatorMfaTab() {
  const { refreshSession } = useAuth()
  const [setup, setSetup] = useState<MfaSetupResponse | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [enableCode, setEnableCode] = useState("")
  const [disableCode, setDisableCode] = useState("")
  const [disablePassword, setDisablePassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const statusQuery = useFetch<MfaStatusResponse>({
    path: AUTH_API.mfaStatus,
    queryKey: ["auth", "mfa", "status"],
  })

  const setupApi = useApi<Record<string, never>>({
    key: "mfa-setup",
    method: "post",
    showSuccessToast: false,
  })

  const enableApi = useApi<{ code: string }>({
    key: "mfa-enable",
    method: "post",
  })

  const disableApi = useApi<{ code: string; password: string }>({
    key: "mfa-disable",
    method: "post",
  })

  const mfaEnabled = statusQuery.data?.mfaEnabled ?? false

  useEffect(() => {
    if (!setup?.otpauthUrl) {
      setQrDataUrl(null)
      return
    }

    let cancelled = false

    void QRCode.toDataURL(setup.otpauthUrl, {
      width: 220,
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    }).then((dataUrl) => {
      if (!cancelled) {
        setQrDataUrl(dataUrl)
      }
    })

    return () => {
      cancelled = true
    }
  }, [setup?.otpauthUrl])

  function resetSetup() {
    setSetup(null)
    setQrDataUrl(null)
    setEnableCode("")
  }

  function handleSetup() {
    setupApi.onRequest({
      path: AUTH_API.mfaSetup,
      data: {},
      onSuccess: (data: MfaSetupResponse) => {
        setSetup(data)
        setEnableCode("")
      },
    })
  }

  function handleEnable() {
    if (enableCode.length !== 6) return

    enableApi.onRequest({
      path: AUTH_API.mfaEnable,
      data: { code: enableCode },
      onSuccess: () => {
        updateAuthUser({ mfaEnabled: true })
        refreshSession()
        resetSetup()
        void statusQuery.refetch()
      },
    })
  }

  function handleDisable() {
    if (disableCode.length !== 6 || !disablePassword) return

    disableApi.onRequest({
      path: AUTH_API.mfaDisable,
      data: { code: disableCode, password: disablePassword },
      onSuccess: () => {
        updateAuthUser({ mfaEnabled: false })
        refreshSession()
        setDisableCode("")
        setDisablePassword("")
        void statusQuery.refetch()
      },
    })
  }

  if (statusQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <Loader
          variant="fetch"
          label="Loading authenticator settings..."
          className="py-16"
        />
      </div>
    )
  }

  if (statusQuery.isError) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <Typography variant="muted">
          Could not load authenticator settings. Please try again.
        </Typography>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => void statusQuery.refetch()}
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="size-5" aria-hidden />
        </span>
        <div>
          <Typography as="h2" variant="h4">
            Authenticator MFA
          </Typography>
          <Typography variant="muted" className="mt-1">
            Protect your account with a time-based code from an authenticator
            app.
          </Typography>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm">
          Status:{" "}
          <span className="font-semibold text-foreground">
            {mfaEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        {!mfaEnabled ? (
          <div className="space-y-5">
            {!setup ? (
              <Button
                type="button"
                onClick={handleSetup}
                disabled={setupApi.isPending}
              >
                {setupApi.isPending ? (
                  <Loader variant="button" />
                ) : (
                  "Set up authenticator"
                )}
              </Button>
            ) : (
              <>
                <Typography variant="muted">
                  Scan this QR code with your authenticator app, or enter the
                  secret manually.
                </Typography>

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  {qrDataUrl ? (
                    // biome-ignore lint/performance/noImgElement: QR preview uses a generated data URL
                    <img
                      src={qrDataUrl}
                      alt="Authenticator QR code"
                      className="size-56 rounded-xl border border-border/60 bg-white p-2"
                    />
                  ) : (
                    <Loader variant="fetch" label="Generating QR..." />
                  )}

                  <div className="space-y-2">
                    <Typography className="text-sm font-medium">
                      Manual secret
                    </Typography>
                    <code className="block break-all rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-sm tracking-wide">
                      {setup.secret}
                    </code>
                  </div>
                </div>

                <div className="space-y-3">
                  <Typography className="text-sm font-medium">
                    Enter the 6-digit code to enable
                  </Typography>
                  <InputOTP
                    maxLength={6}
                    value={enableCode}
                    onChange={setEnableCode}
                    disabled={enableApi.isPending}
                  >
                    <InputOTPGroup className="gap-2">
                      {OTP_SLOTS.map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="size-11 rounded-full border text-base first:rounded-full last:rounded-full"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={handleEnable}
                    disabled={enableApi.isPending || enableCode.length !== 6}
                  >
                    {enableApi.isPending ? (
                      <Loader variant="button" />
                    ) : (
                      "Enable MFA"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetSetup}
                    disabled={enableApi.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <Typography variant="muted">
              Enter a current authenticator code and your password to disable
              MFA.
            </Typography>

            <div className="space-y-3">
              <Typography className="text-sm font-medium">
                Authenticator code
              </Typography>
              <InputOTP
                maxLength={6}
                value={disableCode}
                onChange={setDisableCode}
                disabled={disableApi.isPending}
              >
                <InputOTPGroup className="gap-2">
                  {OTP_SLOTS.map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="size-11 rounded-full border text-base first:rounded-full last:rounded-full"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="space-y-2">
              <Typography className="text-sm font-medium">Password</Typography>
              <div className="relative max-w-md">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={disablePassword}
                  onChange={(event) => setDisablePassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="pr-12"
                  disabled={disableApi.isPending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((open) => !open)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden />
                  ) : (
                    <Eye className="size-4" aria-hidden />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDisable}
              disabled={
                disableApi.isPending ||
                disableCode.length !== 6 ||
                !disablePassword
              }
            >
              {disableApi.isPending ? (
                <Loader variant="button" />
              ) : (
                "Disable MFA"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
