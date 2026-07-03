"use client"

import { Mail } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import useToast from "@/hooks/use-toast"
import { AUTH_API } from "@/lib/auth/constants"
import type { AuthTokenResponse, ResetTokenResponse } from "@/lib/auth/types"

const OTP_SLOTS = [0, 1, 2, 3, 4, 5] as const

type VerifyEmailMode = "signup" | "reset"

type VerifyEmailModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  mode?: VerifyEmailMode
  onVerified?: (result: AuthTokenResponse | ResetTokenResponse) => void
}

export default function VerifyEmailModal({
  open,
  onOpenChange,
  email,
  mode = "signup",
  onVerified,
}: VerifyEmailModalProps) {
  const { toastError } = useToast()
  const [otp, setOtp] = useState("")

  const { onRequest: verifyEmail, isPending: isVerifying } = useApi<{
    email: string
    otp: string
  }>({
    key: "verify-email",
    showSuccessToast: true,
  })

  const { onRequest: verifyResetOtp, isPending: isVerifyingReset } = useApi<{
    email: string
    otp: string
  }>({
    key: "verify-reset-otp",
    showSuccessToast: true,
  })

  const { onRequest: resendVerification, isPending: isResendingSignup } =
    useApi<{ email: string }>({
      key: "resend-verification",
      showSuccessToast: true,
    })

  const { onRequest: resendResetCode, isPending: isResendingReset } = useApi<{
    email: string
  }>({
    key: "forgot-password",
    showSuccessToast: true,
  })

  const isSubmitting = isVerifying || isVerifyingReset
  const isResending = isResendingSignup || isResendingReset

  useEffect(() => {
    if (!open) {
      setOtp("")
    }
  }, [open])

  const handleVerify = () => {
    if (otp.length !== 6) {
      toastError("Please enter the 6-digit verification code.")
      return
    }

    if (mode === "reset") {
      verifyResetOtp({
        path: AUTH_API.verifyResetOtp,
        data: { email, otp },
        onSuccess: (data: ResetTokenResponse) => {
          onOpenChange(false)
          onVerified?.(data)
        },
      })
      return
    }

    verifyEmail({
      path: AUTH_API.verifyEmail,
      data: { email, otp },
      onSuccess: (data: AuthTokenResponse) => {
        onOpenChange(false)
        onVerified?.(data)
      },
    })
  }

  const handleResend = () => {
    if (mode === "reset") {
      resendResetCode({
        path: AUTH_API.forgotPassword,
        data: { email },
        onSuccess: () => setOtp(""),
      })
      return
    }

    resendVerification({
      path: AUTH_API.resendVerification,
      data: { email },
      onSuccess: () => setOtp(""),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="size-5" aria-hidden />
          </span>
          <DialogTitle asChild>
            <Typography as="h2" variant="h4">
              {mode === "reset" ? "Verify reset code" : "Verify your email"}
            </Typography>
          </DialogTitle>
          <DialogDescription asChild>
            <Typography variant="muted" className="text-center">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Enter it below to continue.
            </Typography>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-2">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={isSubmitting}
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

        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={isSubmitting || otp.length !== 6}
        >
          {isSubmitting ? (
            <Loader variant="button" color="white" />
          ) : mode === "reset" ? (
            "Verify Code"
          ) : (
            "Verify Email"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline disabled:opacity-50"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? (
              <Loader variant="button" color="primary" />
            ) : (
              "Resend"
            )}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  )
}
