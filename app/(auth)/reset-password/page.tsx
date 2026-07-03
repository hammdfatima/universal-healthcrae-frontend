"use client"

import { Eye, EyeOff } from "lucide-react"
import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import useToast from "@/hooks/use-toast"
import { AUTH_API } from "@/lib/auth/constants"
import { strongPasswordSchema } from "@/lib/auth/password"
import { clearResetToken, getResetToken } from "@/lib/auth/session"

const resetPasswordSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

const defaultValues = {
  password: "",
  confirmPassword: "",
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toastSuccess } = useToast()
  const [formKey, setFormKey] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetToken, setResetTokenState] = useState<string | null>(null)

  const { onRequest: resetPassword, isPending } = useApi<{
    token: string
    password: string
  }>({
    key: "reset-password",
    showSuccessToast: true,
  })

  useEffect(() => {
    const token = getResetToken()
    if (!token) {
      router.replace("/forgot-password" as Route)
      return
    }

    setResetTokenState(token)
  }, [router])

  if (!resetToken) {
    return <Loader variant="full-page" label="Preparing reset form..." />
  }

  return (
    <div className="w-full">
      <Link href="/" className="mb-8 inline-block">
        <Image
          src="/logo.jpeg"
          alt="Universal Health Charts"
          width={320}
          height={80}
          className="h-10 w-auto sm:h-11"
          quality={100}
          sizes="240px"
          priority
        />
      </Link>

      <Typography as="h1" variant="h2">
        Set a new password
      </Typography>
      <Typography variant="muted" className="mt-2">
        Choose a strong password for your Universal Health Charts account.
      </Typography>

      <div className="mt-8">
        <FormModified
          key={formKey}
          schema={resetPasswordSchema}
          defaultValues={defaultValues}
          formKey={formKey}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={(values) => {
            resetPassword({
              path: AUTH_API.resetPassword,
              data: {
                token: resetToken,
                password: values.password,
              },
              onSuccess: () => {
                clearResetToken()
                toastSuccess("Password updated. You can log in now.")
                setFormKey((key) => key + 1)
                router.push("/login" as Route)
              },
            })
          }}
        >
          {({ components: { Field } }) => (
            <>
              <Field name="password" label="New Password">
                {(field) => (
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter a new password"
                      autoComplete="new-password"
                      className="pr-11"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((visible) => !visible)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                )}
              </Field>

              <Field name="confirmPassword" label="Confirm Password">
                {(field) => (
                  <div className="relative">
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                      className="pr-11"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      onClick={() =>
                        setShowConfirmPassword((visible) => !visible)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                )}
              </Field>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader variant="button" color="white" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </>
          )}
        </FormModified>
      </div>
    </div>
  )
}
