"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Copy, Download, QrCode, RefreshCw, ShieldOff } from "lucide-react"
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
  const { toastSuccess } = useToast()
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  const statusQuery = useFetch<EmergencyAccessStatus>({
    path: EMERGENCY_ACCESS_API.status,
    queryKey: EMERGENCY_ACCESS_QUERY_KEYS.status,
  })

  const generateApi = useApi<Record<string, never>>({
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
    generateApi.onRequest<EmergencyAccessToken>({
      path: EMERGENCY_ACCESS_API.generate,
      data: {},
      onSuccess: () => {
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
            Create a QR code that links to your live medical vault. Anyone who
            scans it will see your latest profile, medications, allergies, lab
            files, imaging files, and emergency contacts.
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
                    {access.lastAccessedAt ? (
                      <Badge variant="secondary" className="rounded-full">
                        Last scanned{" "}
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
                    You have not created an emergency QR code yet. Generate one
                    to share your live medical records when needed.
                  </Typography>
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
              <CardTitle>What scanners will see</CardTitle>
              <CardDescription>
                This preview reflects the same live data shown through your QR
                code, including uploaded files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Typography variant="muted" className="mb-4 text-sm">
                Records update automatically whenever you change your medical
                vault. Regenerating the QR creates a new link and invalidates
                the previous one.
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

function PreviewHint({ accessUrl }: { accessUrl: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
      <Typography variant="small" className="font-semibold">
        Public access link
      </Typography>
      <Typography variant="muted" className="mt-1 break-all text-sm">
        {accessUrl}
      </Typography>
      <Typography variant="muted" className="mt-3 text-sm">
        Open this link on another device to verify what first responders or
        caregivers will see after scanning your QR code.
      </Typography>
    </div>
  )
}
