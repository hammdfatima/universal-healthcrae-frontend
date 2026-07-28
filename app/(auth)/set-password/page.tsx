"use client"

import { Eye, EyeOff } from "lucide-react"
import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useMemo, useState } from "react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import { AUTH_API } from "@/lib/auth/constants"
import { strongPasswordSchema } from "@/lib/auth/password"
import { getPostAuthRedirect } from "@/lib/auth/session"
import type { AuthTokenResponse } from "@/lib/auth/types"

const setPasswordSchema = z
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

function SetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login: saveSession } = useAuth()
  const [formKey, setFormKey] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const token = searchParams.get("token")?.trim() || null
  const email = useMemo(() => {
    const raw = searchParams.get("email")?.trim()
    return raw || null
  }, [searchParams])

  const { onRequest: setPassword, isPending } = useApi<{
    token: string
    password: string
  }>({
    key: "set-password",
    showSuccessToast: true,
  })

  if (!token) {
    return (
      <div className="w-full">
        <Link href="/" className="mb-8 inline-block">
          <Image
            src="/logo.png"
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
          Link unavailable
        </Typography>
        <Typography variant="muted" className="mt-2">
          This set-password link is missing or invalid. Ask the account owner to
          invite you again, or{" "}
          <Link href={"/login" as Route} className="text-primary underline">
            sign in
          </Link>{" "}
          if you already have a password.
        </Typography>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Link href="/" className="mb-8 inline-block">
        <Image
          src="/logo.png"
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
        Set your password
      </Typography>
      <Typography variant="muted" className="mt-2">
        {email
          ? `Create a password for ${email}, then you'll be signed in.`
          : "Create a password for your account, then you'll be signed in."}
      </Typography>

      <div className="mt-8">
        <FormModified
          key={formKey}
          schema={setPasswordSchema}
          defaultValues={defaultValues}
          formKey={formKey}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={(values) => {
            setPassword({
              path: AUTH_API.setPassword,
              data: {
                token,
                password: values.password,
              },
              onSuccess: (data: AuthTokenResponse) => {
                saveSession(data)
                setFormKey((key) => key + 1)
                router.push(getPostAuthRedirect(data.user))
              },
            })
          }}
        >
          {({ components: { Field } }) => (
            <>
              <Field name="password" label="Password">
                {(field) => (
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                      placeholder="Confirm your password"
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
                  "Save password & continue"
                )}
              </Button>
            </>
          )}
        </FormModified>
      </div>
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={<Loader variant="full-page" label="Loading set password..." />}
    >
      <SetPasswordForm />
    </Suspense>
  )
}
