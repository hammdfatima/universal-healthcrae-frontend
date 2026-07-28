"use client"

import Link from "next/link"

import {
  type FamilyMemberFormValues,
  familyMemberDefaultValues,
  familyMemberSchema,
  relationshipOptions,
} from "@/app/(dashboards)/patient/_lib/family-members"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import FormModified from "@/components/ui/form-modified"
import { Loader } from "@/components/ui/loader"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Typography } from "@/components/ui/typography"

type FamilyMemberFormProps = {
  title: string
  description: string
  defaultValues?: FamilyMemberFormValues
  onSubmit: (values: FamilyMemberFormValues) => void
  submitLabel: string
  mode?: "create" | "edit"
  isCouplePlan?: boolean
  isSubmitting?: boolean
}

type SharedFieldProps = {
  isCouplePlan: boolean
  isCreate: boolean
  // biome-ignore lint/suspicious/noExplicitAny: shared between create/edit form schemas
  components: any
  disableEmail?: boolean
}

function FamilyMemberFields({
  isCouplePlan,
  isCreate,
  components,
  disableEmail = false,
}: SharedFieldProps) {
  const { Input: FormInput, Field } = components
  const availableRelationships = isCouplePlan
    ? relationshipOptions.filter((option) => option.value === "Spouse")
    : relationshipOptions

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          name="firstName"
          label="First Name"
          placeholder="First name"
        />
        <FormInput name="lastName" label="Last Name" placeholder="Last name" />
      </div>

      <Field name="relationship" label="Relationship">
        {(field: { value: unknown; onChange: (value: unknown) => void }) => (
          <Select
            value={(field.value as string) || (isCouplePlan ? "Spouse" : "")}
            onValueChange={field.onChange}
            disabled={isCouplePlan}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {availableRelationships.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          disabled={disableEmail}
        />
      </div>

      {isCreate ? (
        <Typography variant="muted" className="text-sm">
          We email them a secure link to set their own password. No temporary
          password is shared with you or sent in plain text.
        </Typography>
      ) : null}

      <Field name="isEmergencyContact">
        {(field: { value: unknown; onChange: (value: unknown) => void }) => (
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
    </>
  )
}

export default function FamilyMemberForm({
  title,
  description,
  defaultValues = familyMemberDefaultValues,
  onSubmit,
  submitLabel,
  mode = "edit",
  isCouplePlan = false,
  isSubmitting = false,
}: FamilyMemberFormProps) {
  const isCreate = mode === "create"

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
            onSubmit(
              isCouplePlan ? { ...values, relationship: "Spouse" } : values
            )
          }}
        >
          {({ components }) => (
            <>
              <FamilyMemberFields
                isCouplePlan={isCouplePlan}
                isCreate={isCreate}
                components={components}
                disableEmail={!isCreate}
              />
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" asChild>
                  <Link href="/patient/family-members">Cancel</Link>
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
          )}
        </FormModified>
      </div>
    </div>
  )
}
