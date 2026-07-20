"use client"

import Link from "next/link"
import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import {
  type PharmacyFormValues,
  pharmacyDefaultValues,
  pharmacySchema,
} from "@/app/(dashboards)/patient/_lib/pharmacies"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"

type PharmacyFormProps = {
  title: string
  description: string
  defaultValues?: PharmacyFormValues
  onSubmit: (values: PharmacyFormValues) => void
  submitLabel: string
  isSubmitting?: boolean
}

export default function PharmacyForm({
  title,
  description,
  defaultValues = pharmacyDefaultValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: PharmacyFormProps) {
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
          schema={pharmacySchema}
          defaultValues={defaultValues}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={onSubmit}
        >
          {({ components }) => {
            const { Input: FormInput, Textarea } = components

            return (
              <>
                <FormInput
                  name="name"
                  label="Pharmacy Name"
                  placeholder="Pharmacy name"
                />

                <FormInput
                  name="phone"
                  label="Phone"
                  placeholder="Phone number"
                  type="tel"
                />

                <Textarea
                  name="address"
                  label="Address"
                  placeholder="Street address, city, state"
                  rows={3}
                />

                <Textarea
                  name="notes"
                  label="Notes (optional)"
                  placeholder="Hours, refill preferences, or other details"
                  rows={3}
                />

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" asChild>
                    <Link href={healthRecordHref("pharmacy")}>Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader variant="button" color="white" />
                    ) : (
                      submitLabel
                    )}
                  </Button>
                </div>
              </>
            )
          }}
        </FormModified>
      </div>
    </div>
  )
}
