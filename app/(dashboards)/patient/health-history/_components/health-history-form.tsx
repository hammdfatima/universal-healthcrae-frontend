"use client"

import Link from "next/link"

import {
  type HealthHistoryFormValues,
  healthHistoryDefaultValues,
  healthHistorySchema,
} from "@/app/(dashboards)/patient/_lib/health-history"
import DatePickerField from "@/components/date-picker-field"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"

type HealthHistoryFormProps = {
  title: string
  description: string
  defaultValues?: HealthHistoryFormValues
  onSubmit: (values: HealthHistoryFormValues) => void
  submitLabel: string
  isSubmitting?: boolean
}

export default function HealthHistoryForm({
  title,
  description,
  defaultValues = healthHistoryDefaultValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: HealthHistoryFormProps) {
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
          schema={healthHistorySchema}
          defaultValues={defaultValues}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={onSubmit}
        >
          {({ components }) => {
            const { Input: FormInput, Textarea, Field } = components

            return (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    name="illnessName"
                    label="Enter name of illness or condition"
                    placeholder="Enter name of illness or condition"
                  />

                  <Field name="diagnosisDate" label="Date of Diagnosis">
                    {(field) => (
                      <DatePickerField
                        value={field.value as Date | undefined}
                        onChange={field.onChange}
                        placeholder="MM/DD/YYYY"
                      />
                    )}
                  </Field>
                </div>

                <FormInput
                  name="prescribedBy"
                  label="GP / Consultant Name"
                  placeholder="GP / Consultant Name"
                />

                <Textarea
                  name="details"
                  label="Details (including any medication or treatment)"
                  placeholder="Details (including any medication or treatment)"
                  rows={5}
                />

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/patient/health-history">Close</Link>
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
