"use client"

import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/ui/loader"
import useApi from "@/hooks/use-api"
import { AUTH_API } from "@/lib/auth/constants"
import type { StepUpTokenResponse } from "@/lib/auth/types"

type StepUpPasswordDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  onVerified: (stepUpToken: string) => void
}

/**
 * HIPAA §2.4 step-up authentication: re-prompts for the current password
 * before sensitive actions (data export, account deletion) and exchanges it
 * for a short-lived step-up token via POST /auth/step-up/verify.
 */
export default function StepUpPasswordDialog({
  open,
  onOpenChange,
  title = "Confirm your password",
  description = "For your security, please re-enter your password to continue with this sensitive action.",
  onVerified,
}: StepUpPasswordDialogProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { onRequest: verifyStepUp, isPending } = useApi<{
    password: string
  }>({
    key: "step-up-verify",
    method: "post",
    showSuccessToast: false,
  })

  useEffect(() => {
    if (!open) {
      setPassword("")
      setShowPassword(false)
    }
  }, [open])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!password) return

    verifyStepUp({
      path: AUTH_API.stepUpVerify,
      data: { password },
      onSuccess: (data: StepUpTokenResponse) => {
        onOpenChange(false)
        onVerified(data.stepUpToken)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="size-5" aria-hidden />
              </span>
              <div>
                <DialogTitle>{title}</DialogTitle>
              </div>
            </div>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-2">
            <Label htmlFor="step-up-password">Password</Label>
            <div className="relative">
              <Input
                id="step-up-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                autoFocus
                className="pr-12"
                disabled={isPending}
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </Button>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !password}>
              {isPending ? (
                <Loader variant="button" color="white" />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
