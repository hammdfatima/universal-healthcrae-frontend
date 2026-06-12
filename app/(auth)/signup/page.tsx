"use client"

import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"

import {
  createProfileFromSignup,
  resetOnboardingStatus,
  saveProfileToStorage,
} from "@/app/(dashboards)/patient/_lib/settings"
import VerifyEmailModal from "@/app/_components/verify-email-modal"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import FormModified from "@/components/ui/form-modified"
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    agreeToTerms: z.boolean().refine((value) => value === true, {
      message: "You must agree to the Terms of Use and Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
}

export default function SignupPage() {
  const router = useRouter()
  const { toastSuccess } = useToast()
  const [formKey, setFormKey] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [signupData, setSignupData] = useState<{
    firstName: string
    lastName: string
    email: string
  } | null>(null)

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
        Create your account
      </Typography>
      <Typography variant="muted" className="mt-2">
        Join Universal Health Charts and take control of your health data.
      </Typography>

      <div className="mt-8">
        <FormModified
          key={formKey}
          schema={signupSchema}
          defaultValues={defaultValues}
          formKey={formKey}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={(values) => {
            setSignupData({
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
            })
            setSubmittedEmail(values.email)
            setVerifyOpen(true)
            setShowPassword(false)
            setShowConfirmPassword(false)
          }}
        >
          {({ components: { Input: FormInput, Field } }) => (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormInput
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  autoComplete="given-name"
                />
                <FormInput
                  name="lastName"
                  label="Last Name"
                  placeholder="Smith"
                  autoComplete="family-name"
                />
              </div>

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
                      placeholder="Create a password"
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

              <Field name="agreeToTerms">
                {(field) => (
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm leading-snug text-muted-foreground"
                    >
                      I agree to the{" "}
                      <span className="font-medium text-primary">
                        Terms of Use
                      </span>{" "}
                      and{" "}
                      <span className="font-medium text-primary">
                        Privacy Policy
                      </span>
                      .
                    </label>
                  </div>
                )}
              </Field>

              <Button type="submit" className="w-full">
                Create Account
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
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
          if (signupData) {
            saveProfileToStorage(createProfileFromSignup(signupData))
            resetOnboardingStatus()
          }
          toastSuccess("Account created! Let's set up your profile.")
          setFormKey((key) => key + 1)
          setSignupData(null)
          router.push("/onboarding/patient")
        }}
      />
    </div>
  )
}
