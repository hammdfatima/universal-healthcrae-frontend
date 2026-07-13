"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  Copy,
  Download,
  Eye,
  EyeOff,
  QrCode,
  RefreshCw,
  ShieldOff,
} from "lucide-react"
import QRCode from "qrcode"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import useToast from "@/hooks/use-toast"
import {
  EMERGENCY_ACCESS_API,
  EMERGENCY_ACCESS_QUERY_KEYS,
  type EmergencyAccessStatus,
  type EmergencyAccessToken,
} from "@/lib/api/emergency-access"

export default function EmergencyQrPageContent() {
  const queryClient = useQueryClient()
  const { toastSuccess, toastError } = useToast()
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")

  const statusQuery = useFetch<EmergencyAccessStatus>({
    path: EMERGENCY_ACCESS_API.status,
    queryKey: EMERGENCY_ACCESS_QUERY_KEYS.status,
  })

  const generateApi = useApi<{ pin: string }>({
    key: "generate-emergency-access",
    method: "post",
    showSuccessToast: true,
  })

  const revokeApi = useApi<Record<string, never>>({
    key: "revoke-emergency-access",
    method: "delete",
    showSuccessToast: true,
  })

  const access = statusQuery.data?.access ?? null

  useEffect(() => {
    if (!access?.accessUrl) {
      setQrDataUrl(null)
      return
    }

    let cancelled = false

    void QRCode.toDataURL(access.accessUrl, {
      width: 280,
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
  }, [access?.accessUrl])

  function refreshStatus() {
    void queryClient.invalidateQueries({
      queryKey: EMERGENCY_ACCESS_QUERY_KEYS.status,
    })
  }

  function handleGenerate() {
    if (!/^\d{4,8}$/.test(pin)) {
      toastError("PIN must be 4 to 8 digits.")
      return
    }

    if (pin !== confirmPin) {
      toastError("PIN confirmation does not match.")
      return
    }

    generateApi.onRequest<EmergencyAccessToken>({
      path: EMERGENCY_ACCESS_API.generate,
      data: { pin },
      onSuccess: () => {
        setPin("")
        setConfirmPin("")
        refreshStatus()
      },
    })
  }

  function handleRevoke() {
    revokeApi.onRequest({
      path: EMERGENCY_ACCESS_API.revoke,
      data: {},
      onSuccess: () => {
        refreshStatus()
      },
    })
  }

  async function handleDownloadQr() {
    if (!qrDataUrl || !access) {
      return
    }

    const link = document.createElement("a")
    link.href = qrDataUrl
    link.download = "emergency-qr-code.png"
    link.click()
  }

  async function handleCopyLink() {
    if (!access?.accessUrl) {
      return
    }

    await navigator.clipboard.writeText(access.accessUrl)
    toastSuccess("Emergency access link copied.")
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Typography variant="h3">Emergency QR Access</Typography>
        {!statusQuery.isLoading ? (
          <Typography variant="muted" className="mt-2 max-w-2xl">
            Create a PIN-protected QR code that unlocks your medical vault for
            72 hours. Scanners must enter your PIN before any records are shown.
          </Typography>
        ) : null}
      </div>

      {statusQuery.isLoading ? (
        <Loader
          variant="fetch"
          label="Loading emergency QR access..."
          className="min-h-[50vh] py-16"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="size-5 text-primary" aria-hidden />
                Your QR Code
              </CardTitle>
              <CardDescription>
                Save or print this code for emergency access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {access?.isActive && qrDataUrl ? (
                <>
                  <div className="flex justify-center rounded-2xl border border-border/60 bg-white p-4">
                    {/* biome-ignore lint/performance/noImgElement: QR preview uses a generated data URL */}
                    <img
                      src={qrDataUrl}
                      alt="Emergency medical access QR code"
                      className="size-[240px]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="rounded-full">
                      Active
                    </Badge>
                    <Badge variant="secondary" className="rounded-full">
                      Expires {new Date(access.expiresAt).toLocaleString()}
                    </Badge>
                    {access.lastAccessedAt ? (
                      <Badge variant="secondary" className="rounded-full">
                        Last unlocked{" "}
                        {new Date(access.lastAccessedAt).toLocaleDateString()}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="grid gap-2">
                    <Button
                      type="button"
                      className="gap-1.5"
                      onClick={() => void handleDownloadQr()}
                    >
                      <Download className="size-4" aria-hidden />
                      Save QR Image
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => void handleCopyLink()}
                    >
                      <Copy className="size-4" aria-hidden />
                      Copy Access Link
                    </Button>
                    <PinFields
                      pin={pin}
                      confirmPin={confirmPin}
                      onPinChange={setPin}
                      onConfirmPinChange={setConfirmPin}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-1.5"
                      onClick={handleGenerate}
                      disabled={generateApi.isPending}
                    >
                      <RefreshCw className="size-4" aria-hidden />
                      Regenerate QR
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="gap-1.5"
                      onClick={handleRevoke}
                      disabled={revokeApi.isPending}
                    >
                      <ShieldOff className="size-4" aria-hidden />
                      Revoke Access
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4 rounded-2xl border border-dashed border-border/70 bg-muted/20 p-6 text-center">
                  <QrCode
                    className="mx-auto size-12 text-muted-foreground/60"
                    aria-hidden
                  />
                  <Typography variant="muted" className="text-sm">
                    Set a 4–8 digit PIN, then generate a QR code. First
                    responders will need both the link and your PIN.
                  </Typography>
                  <PinFields
                    pin={pin}
                    confirmPin={confirmPin}
                    onPinChange={setPin}
                    onConfirmPinChange={setConfirmPin}
                  />
                  <Button
                    type="button"
                    onClick={handleGenerate}
                    disabled={generateApi.isPending}
                  >
                    Generate Emergency QR
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>How emergency access works</CardTitle>
              <CardDescription>
                Links expire after 72 hours. Wrong PIN attempts are locked after
                repeated failures and logged for audit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Typography variant="muted" className="mb-4 text-sm">
                Regenerating creates a new link and PIN requirement and
                invalidates the previous QR code.
              </Typography>
              {access?.isActive ? (
                <PreviewHint accessUrl={access.accessUrl} />
              ) : (
                <Typography variant="muted" className="text-sm">
                  Generate your QR code to enable emergency access.
                </Typography>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function PinFields({
  pin,
  confirmPin,
  onPinChange,
  onConfirmPinChange,
}: {
  pin: string
  confirmPin: string
  onPinChange: (value: string) => void
  onConfirmPinChange: (value: string) => void
}) {
  const [showPin, setShowPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)

  return (
    <div className="grid gap-2 text-left">
      <div className="relative">
        <Input
          type={showPin ? "text" : "password"}
          inputMode="numeric"
          autoComplete="new-password"
          pattern="\d{4,8}"
          maxLength={8}
          placeholder="Create 4–8 digit PIN"
          className="pr-11"
          value={pin}
          onChange={(event) =>
            onPinChange(event.target.value.replace(/\D/g, "").slice(0, 8))
          }
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
      <div className="relative">
        <Input
          type={showConfirmPin ? "text" : "password"}
          inputMode="numeric"
          autoComplete="new-password"
          pattern="\d{4,8}"
          maxLength={8}
          placeholder="Confirm PIN"
          className="pr-11"
          value={confirmPin}
          onChange={(event) =>
            onConfirmPinChange(
              event.target.value.replace(/\D/g, "").slice(0, 8)
            )
          }
        />
        <button
          type="button"
          className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={showConfirmPin ? "Hide confirm PIN" : "Show confirm PIN"}
          onClick={() => setShowConfirmPin((visible) => !visible)}
        >
          {showConfirmPin ? (
            <EyeOff className="size-4" aria-hidden />
          ) : (
            <Eye className="size-4" aria-hidden />
          )}
        </button>
      </div>
    </div>
  )
}

function PreviewHint({ accessUrl }: { accessUrl: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
      <Typography variant="small" className="font-semibold">
        PIN-protected access link
      </Typography>
      <Typography variant="muted" className="mt-1 break-all text-sm">
        {accessUrl}
      </Typography>
      <Typography variant="muted" className="mt-3 text-sm">
        Opening this link only shows a PIN prompt. Records appear after the
        correct PIN is entered.
      </Typography>
    </div>
  )
}
