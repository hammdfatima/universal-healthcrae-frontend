"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  type CareProviderFormValues,
  careProviderDefaultValues,
  careProviderSchema,
} from "@/app/(dashboards)/patient/_lib/providers"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

type CareProviderFormProps = {
  title: string
  description: string
  defaultValues?: CareProviderFormValues
  onSubmit: (values: CareProviderFormValues) => void
  submitLabel: string
}

export default function CareProviderForm({
  title,
  description,
  defaultValues = careProviderDefaultValues,
  onSubmit,
  submitLabel,
}: CareProviderFormProps) {
  const router = useRouter()
  const { toastSuccess } = useToast()

  return (
    <div className="mx-auto max-w-7xl p-4">
      <Typography as="h1" variant="h3">
        {title}
      </Typography>
      <Typography variant="muted" className="mt-1">
        {description}
      </Typography>

      <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <FormModified
          schema={careProviderSchema}
          defaultValues={defaultValues}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={(values) => {
            onSubmit(values)
            toastSuccess(
              submitLabel === "Save"
                ? "Care provider added successfully."
                : "Care provider updated successfully."
            )
            router.push("/patient/provider")
          }}
        >
          {({ components }) => {
            const { Input: FormInput, Textarea } = components

            return (
              <>
                <FormInput
                  name="name"
                  label="Name"
                  placeholder="Provider name"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    name="phone"
                    label="Phone"
                    placeholder="Phone number"
                    type="tel"
                  />
                  <FormInput
                    name="email"
                    label="Email (optional)"
                    placeholder="Email address"
                    type="email"
                  />
                </div>

                <Textarea
                  name="clinicDetails"
                  label="Clinic Details (optional)"
                  placeholder="Clinic name, address, or other details"
                  rows={4}
                />

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/patient/provider">Close</Link>
                  </Button>
                  <Button type="submit">{submitLabel}</Button>
                </div>
              </>
            )
          }}
        </FormModified>
      </div>
    </div>
  )
}
