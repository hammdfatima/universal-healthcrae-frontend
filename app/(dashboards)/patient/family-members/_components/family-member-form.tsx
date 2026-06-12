"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  type FamilyMemberFormValues,
  familyMemberDefaultValues,
  familyMemberSchema,
  relationshipOptions,
} from "@/app/(dashboards)/patient/_lib/family-members"
import DatePickerField from "@/components/date-picker-field"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import FormModified from "@/components/ui/form-modified"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

type FamilyMemberFormProps = {
  title: string
  description: string
  defaultValues?: FamilyMemberFormValues
  onSubmit: (values: FamilyMemberFormValues) => void
  submitLabel: string
}

export default function FamilyMemberForm({
  title,
  description,
  defaultValues = familyMemberDefaultValues,
  onSubmit,
  submitLabel,
}: FamilyMemberFormProps) {
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
          schema={familyMemberSchema}
          defaultValues={defaultValues}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={(values) => {
            onSubmit(values)
            toastSuccess(
              submitLabel === "Save Member"
                ? "Family member added successfully."
                : "Family member updated successfully."
            )
            router.push("/patient/family-members")
          }}
        >
          {({ components }) => {
            const { Input: FormInput, Field } = components

            return (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    name="firstName"
                    label="First Name"
                    placeholder="First name"
                  />
                  <FormInput
                    name="lastName"
                    label="Last Name"
                    placeholder="Last name"
                  />
                </div>

                <Field name="relationship" label="Relationship">
                  {(field) => (
                    <Select
                      value={field.value as string}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Field>

                <Field name="dateOfBirth" label="Date of Birth">
                  {(field) => (
                    <DatePickerField
                      value={field.value as Date | undefined}
                      onChange={field.onChange}
                      placeholder="MM/DD/YYYY"
                    />
                  )}
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    name="phone"
                    label="Phone Number"
                    placeholder="(555) 000-0000"
                  />
                  <FormInput
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="email@example.com"
                  />
                </div>

                <Field name="isEmergencyContact">
                  {(field) => (
                    <label
                      htmlFor="isEmergencyContact"
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3"
                    >
                      <Checkbox
                        id="isEmergencyContact"
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                      <div>
                        <Typography variant="small" className="font-medium">
                          Mark as emergency contact
                        </Typography>
                        <Typography variant="muted" className="text-xs">
                          Include this person in your emergency contact list.
                        </Typography>
                      </div>
                    </label>
                  )}
                </Field>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/patient/family-members">Cancel</Link>
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
