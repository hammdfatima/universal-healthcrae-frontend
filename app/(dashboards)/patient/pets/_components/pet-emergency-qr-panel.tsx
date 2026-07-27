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
  PET_EMERGENCY_ACCESS_API,
  PET_EMERGENCY_ACCESS_QUERY_KEYS,
  type PetEmergencyAccessStatus,
  type PetEmergencyAccessToken,
} from "@/lib/api/pet-emergency-access"

type PetEmergencyQrPanelProps = {
  petId: string
  petName: string
}

export default function PetEmergencyQrPanel({
  petId,
  petName,
}: PetEmergencyQrPanelProps) {
  const queryClient = useQueryClient()
  const { toastSuccess, toastError } = useToast()
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)

  const statusQuery = useFetch<PetEmergencyAccessStatus>({
    path: PET_EMERGENCY_ACCESS_API.status(petId),
    queryKey: PET_EMERGENCY_ACCESS_QUERY_KEYS.status(petId),
  })

  const generateApi = useApi<{ pin: string }>({
    key: "generate-pet-emergency-access",
    method: "post",
    showSuccessToast: true,
  })

  const revokeApi = useApi<Record<string, never>>({
    key: "revoke-pet-emergency-access",
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
      queryKey: PET_EMERGENCY_ACCESS_QUERY_KEYS.status(petId),
    })
  }

  function handleGenerate() {
    if (!/^\d{4}$/.test(pin)) {
      toastError("PIN must be exactly 4 digits.")
      return
    }

    if (pin !== confirmPin) {
      toastError("PIN confirmation does not match.")
      return
    }

    generateApi.onRequest<PetEmergencyAccessToken>({
      path: PET_EMERGENCY_ACCESS_API.generate(petId),
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
      path: PET_EMERGENCY_ACCESS_API.revoke(petId),
      data: {},
      onSuccess: () => {
        refreshStatus()
      },
    })
  }

  function handleDownloadQr() {
    if (!qrDataUrl) return

    const link = document.createElement("a")
    link.href = qrDataUrl
    link.download = `${petName.replace(/\s+/g, "-").toLowerCase()}-pet-qr.png`
    link.click()
  }

  async function handleCopyLink() {
    if (!access?.accessUrl) return

    await navigator.clipboard.writeText(access.accessUrl)
    toastSuccess("Pet emergency access link copied.")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="size-5 text-primary" aria-hidden />
            Pet QR Code
          </CardTitle>
          <CardDescription>
            Save or print this code for emergency pet access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 overflow-hidden">
          {statusQuery.isLoading ? (
            <Loader variant="fetch" label="Loading pet QR access..." />
          ) : access?.isActive && qrDataUrl ? (
            <>
              <div className="flex justify-center rounded-2xl border border-border/60 bg-white p-4">
                {/* biome-ignore lint/performance/noImgElement: QR preview uses a generated data URL */}
                <img
                  src={qrDataUrl}
                  alt={`${petName} emergency QR code`}
                  className="h-auto w-full max-w-[240px]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="max-w-full rounded-full text-center leading-tight whitespace-normal"
                >
                  Active
                </Badge>
                <Badge
                  variant="secondary"
                  className="max-w-full rounded-full text-center leading-tight whitespace-normal"
                >
                  Expires {new Date(access.expiresAt).toLocaleString()}
                </Badge>
                {access.lastAccessedAt ? (
                  <Badge
                    variant="secondary"
                    className="max-w-full rounded-full text-center leading-tight whitespace-normal"
                  >
                    Last unlocked{" "}
                    {new Date(access.lastAccessedAt).toLocaleDateString()}
                  </Badge>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Button type="button" onClick={handleDownloadQr}>
                  <Download className="size-4" aria-hidden />
                  Save QR Image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleCopyLink()}
                >
                  <Copy className="size-4" aria-hidden />
                  Copy Access Link
                </Button>
                <PinFields
                  pin={pin}
                  confirmPin={confirmPin}
                  showPin={showPin}
                  showConfirmPin={showConfirmPin}
                  onPinChange={setPin}
                  onConfirmPinChange={setConfirmPin}
                  onTogglePin={() => setShowPin((value) => !value)}
                  onToggleConfirmPin={() =>
                    setShowConfirmPin((value) => !value)
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={generateApi.isPending}
                >
                  <RefreshCw className="size-4" aria-hidden />
                  Regenerate QR
                </Button>
                <Button
                  type="button"
                  variant="destructive"
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
                Set a 4-digit PIN, then generate a QR code. Only this pet&apos;s
                info is shared — not your human medical vault.
              </Typography>
              <PinFields
                pin={pin}
                confirmPin={confirmPin}
                showPin={showPin}
                showConfirmPin={showConfirmPin}
                onPinChange={setPin}
                onConfirmPinChange={setConfirmPin}
                onTogglePin={() => setShowPin((value) => !value)}
                onToggleConfirmPin={() => setShowConfirmPin((value) => !value)}
              />
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={generateApi.isPending}
              >
                Generate Pet QR
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>How pet QR access works</CardTitle>
          <CardDescription>
            Links expire after 72 hours. Wrong PIN attempts are locked after
            repeated failures and logged for audit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Typography variant="muted" className="text-sm">
            Regenerating creates a new link and PIN requirement and invalidates
            the previous QR code.
          </Typography>
          <Typography variant="small" className="font-semibold">
            Unlocked pet profile includes
          </Typography>
          <ul className="flex flex-wrap gap-2">
            {[
              "Identity & microchip",
              "Owner contact",
              "Emergency contact",
              "Veterinarian",
              "Conditions",
              "Medications",
              "Allergies",
              "Vaccinations",
            ].map((section) => (
              <li key={section}>
                <Badge
                  variant="secondary"
                  className="max-w-full rounded-full text-center leading-tight whitespace-normal"
                >
                  {section}
                </Badge>
              </li>
            ))}
          </ul>
          {access?.isActive ? (
            <Typography variant="muted" className="text-sm break-all">
              Preview link: {access.accessUrl}
            </Typography>
          ) : (
            <Typography variant="muted" className="text-sm">
              Generate your QR code to enable emergency pet access.
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PinFields({
  pin,
  confirmPin,
  showPin,
  showConfirmPin,
  onPinChange,
  onConfirmPinChange,
  onTogglePin,
  onToggleConfirmPin,
}: {
  pin: string
  confirmPin: string
  showPin: boolean
  showConfirmPin: boolean
  onPinChange: (value: string) => void
  onConfirmPinChange: (value: string) => void
  onTogglePin: () => void
  onToggleConfirmPin: () => void
}) {
  return (
    <div className="grid gap-3 text-left">
      <div className="relative">
        <Input
          type={showPin ? "text" : "password"}
          inputMode="numeric"
          maxLength={4}
          placeholder="4-digit PIN"
          value={pin}
          onChange={(event) =>
            onPinChange(event.target.value.replace(/\D/g, "").slice(0, 4))
          }
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          onClick={onTogglePin}
          aria-label={showPin ? "Hide PIN" : "Show PIN"}
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
          maxLength={4}
          placeholder="Confirm PIN"
          value={confirmPin}
          onChange={(event) =>
            onConfirmPinChange(
              event.target.value.replace(/\D/g, "").slice(0, 4)
            )
          }
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          onClick={onToggleConfirmPin}
          aria-label={showConfirmPin ? "Hide confirm PIN" : "Show confirm PIN"}
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
