"use client"

import axios from "axios"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"

import VerifyEmailModal from "@/app/_components/verify-email-modal"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import useToast from "@/hooks/use-toast"
import { AUTH_API } from "@/lib/auth/constants"
import { getPostAuthRedirect } from "@/lib/auth/session"
import type { AuthTokenResponse } from "@/lib/auth/types"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
})

const defaultValues = {
  email: "",
  password: "",
}

export default function LoginPage() {
  const router = useRouter()
  const { toastSuccess } = useToast()
  const [formKey, setFormKey] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")

  const { login: saveSession } = useAuth()
  const { onRequest: login, isPending } = useApi<{
    email: string
    password: string
  }>({
    key: "login",
    showSuccessToast: false,
  })

  const completeLogin = (result: AuthTokenResponse) => {
    saveSession(result)
    toastSuccess("Welcome back!")
    setFormKey((key) => key + 1)
    router.push(getPostAuthRedirect(result.user))
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
        Welcome back
      </Typography>
      <Typography variant="muted" className="mt-2">
        Log in to access your secure health information .
      </Typography>

      <div className="mt-8">
        <FormModified
          key={formKey}
          schema={loginSchema}
          defaultValues={defaultValues}
          formKey={formKey}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={(values) => {
            login({
              path: AUTH_API.login,
              data: {
                email: values.email,
                password: values.password,
              },
              onSuccess: (data: AuthTokenResponse) => {
                completeLogin(data)
              },
              onError: (error) => {
                if (
                  axios.isAxiosError(error) &&
                  error.response?.status === 403
                ) {
                  setSubmittedEmail(values.email)
                  setVerifyOpen(true)
                }
              },
            })
          }}
        >
          {({ components: { Input: FormInput, Field } }) => (
            <>
              <FormInput
                name="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />

              <Field name="password" label="Password">
                {(field) => (
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
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

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:underline"
                  onClick={() => router.push("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader variant="button" color="white" />
                ) : (
                  "Log in"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={() => router.push("/signup")}
                >
                  Sign up
                </button>
              </p>
            </>
          )}
        </FormModified>
      </div>

      <VerifyEmailModal
        open={verifyOpen}
        onOpenChange={setVerifyOpen}
        email={submittedEmail}
        mode="signup"
        onVerified={(result) => {
          if ("token" in result) {
            completeLogin(result)
          }
        }}
      />
    </div>
  )
}
