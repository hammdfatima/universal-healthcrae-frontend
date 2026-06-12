"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"

import VerifyEmailModal from "@/app/_components/verify-email-modal"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
})

const defaultValues = {
  email: "",
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toastSuccess } = useToast()
  const [formKey, setFormKey] = useState(0)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")

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
            setSubmittedEmail(values.email)
            setVerifyOpen(true)
            toastSuccess("Verification code sent to your email.")
            setFormKey((key) => key + 1)
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

              <Button type="submit" className="w-full">
                Send Verification Code
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
        onVerified={() => {
          toastSuccess("You can now set a new password.")
          router.push("/login")
        }}
      />
    </div>
  )
}
