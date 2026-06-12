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
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

const OTP_SLOTS = [0, 1, 2, 3, 4, 5] as const

type VerifyEmailModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  onVerified?: () => void
}

export default function VerifyEmailModal({
  open,
  onOpenChange,
  email,
  onVerified,
}: VerifyEmailModalProps) {
  const { toastSuccess, toastError } = useToast()
  const [otp, setOtp] = useState("")

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

    toastSuccess("Email verified successfully!")
    onOpenChange(false)
    onVerified?.()
  }

  const handleResend = () => {
    toastSuccess(`A new verification code was sent to ${email}.`)
    setOtp("")
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
              Verify your email
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
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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

        <Button className="w-full" onClick={handleVerify}>
          Verify Email
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            className="font-semibold text-primary hover:underline"
            onClick={handleResend}
          >
            Resend
          </button>
        </p>
      </DialogContent>
    </Dialog>
  )
}
