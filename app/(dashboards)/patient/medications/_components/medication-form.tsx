"use client"

import Link from "next/link"

import {
  type MedicationFormValues,
  medicationDefaultValues,
  medicationSchema,
} from "@/app/(dashboards)/patient/_lib/medications"
import DatePickerField from "@/components/date-picker-field"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"

type MedicationFormProps = {
  title: string
  description: string
  defaultValues?: MedicationFormValues
  onSubmit: (values: MedicationFormValues) => void
  submitLabel: string
  isSubmitting?: boolean
}

export default function MedicationForm({
  title,
  description,
  defaultValues = medicationDefaultValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: MedicationFormProps) {
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
          schema={medicationSchema}
          defaultValues={defaultValues}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={onSubmit}
        >
          {({ components }) => {
            const { Input: FormInput, Field } = components

            return (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    name="medicineName"
                    label="Medicine Name"
                    placeholder="Medicine Name"
                  />
                  <FormInput
                    name="condition"
                    label="Condition"
                    placeholder="Condition"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    name="prescribedBy"
                    label="Prescribed by (GP / Consultant Name)"
                    placeholder="Prescribed By"
                  />
                  <FormInput
                    name="dosage"
                    label="Dosage"
                    placeholder="Dosage"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field name="startDate" label="Start Date">
                    {(field) => (
                      <DatePickerField
                        value={field.value as Date | undefined}
                        onChange={field.onChange}
                        placeholder="MM/DD/YYYY"
                      />
                    )}
                  </Field>

                  <Field name="endDate" label="End Date (optional)">
                    {(field) => (
                      <DatePickerField
                        value={field.value as Date | undefined}
                        onChange={field.onChange}
                        placeholder="MM/DD/YYYY"
                      />
                    )}
                  </Field>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/patient/medications">Close</Link>
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
