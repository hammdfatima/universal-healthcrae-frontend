"use client"

import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"

import VerifyEmailModal from "@/app/_components/verify-email-modal"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { AUTH_API } from "@/lib/auth/constants"
import { setResetToken } from "@/lib/auth/session"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
})

const defaultValues = {
  email: "",
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [formKey, setFormKey] = useState(0)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")

  const { onRequest: requestReset, isPending } = useApi<{ email: string }>({
    key: "forgot-password",
    showSuccessToast: true,
  })

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
        Forgot password?
      </Typography>
      <Typography variant="muted" className="mt-2">
        Enter your email and we&apos;ll send you a verification code to reset
        your password.
      </Typography>

      <div className="mt-8">
        <FormModified
          key={formKey}
          schema={forgotPasswordSchema}
          defaultValues={defaultValues}
          formKey={formKey}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={(values) => {
            requestReset({
              path: AUTH_API.forgotPassword,
              data: { email: values.email },
              onSuccess: () => {
                setSubmittedEmail(values.email)
                setVerifyOpen(true)
                setFormKey((key) => key + 1)
              },
            })
          }}
        >
          {({ components: { Input: FormInput } }) => (
            <>
              <FormInput
                name="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader variant="button" color="white" />
                ) : (
                  "Send Verification Code"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={() => router.push("/login")}
                >
                  Log in
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
        mode="reset"
        onVerified={(result) => {
          if ("resetToken" in result) {
            setResetToken(result.resetToken)
            router.push("/reset-password" as Route)
          }
        }}
      />
    </div>
  )
}
