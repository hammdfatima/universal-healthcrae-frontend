"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  type VaccinationFormValues,
  vaccinationDefaultValues,
  vaccinationSchema,
} from "@/app/(dashboards)/patient/_lib/vaccinations"
import DatePickerField from "@/components/date-picker-field"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import TimePickerField from "@/components/ui/time-picker-field"
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

type VaccinationFormProps = {
  title: string
  description: string
  defaultValues?: VaccinationFormValues
  onSubmit: (values: VaccinationFormValues) => void
  submitLabel: string
}

export default function VaccinationForm({
  title,
  description,
  defaultValues = vaccinationDefaultValues,
  onSubmit,
  submitLabel,
}: VaccinationFormProps) {
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
          schema={vaccinationSchema}
          defaultValues={defaultValues}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={(values) => {
            onSubmit(values)
            toastSuccess(
              submitLabel === "Save"
                ? "Vaccination added successfully."
                : "Vaccination updated successfully."
            )
            router.push("/patient/vaccinations")
          }}
        >
          {({ components }) => {
            const { Input: FormInput, Field } = components

            return (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    name="vaccineName"
                    label="Vaccine Name"
                    placeholder="Vaccine Name"
                  />
                  <FormInput
                    name="prescribedBy"
                    label="Prescribed By"
                    placeholder="Prescribed By"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    name="administeredBy"
                    label="Administrated by"
                    placeholder="Administrated By"
                  />
                  <FormInput
                    name="dosage"
                    label="Dosage"
                    placeholder="Dosage"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field name="date" label="Date">
                    {(field) => (
                      <DatePickerField
                        value={field.value as Date | undefined}
                        onChange={field.onChange}
                        placeholder="MM/DD/YYYY"
                      />
                    )}
                  </Field>

                  <Field name="time" label="Time">
                    {(field) => (
                      <TimePickerField
                        value={field.value as string}
                        onChange={field.onChange}
                      />
                    )}
                  </Field>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/patient/vaccinations">Close</Link>
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
