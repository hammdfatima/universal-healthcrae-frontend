"use client"

import {
  bloodGroupOptions,
  genderOptions,
  type ProfileFormValues,
  profileSchema,
} from "@/app/(dashboards)/patient/_lib/settings"
import ProfileImageField from "@/app/(dashboards)/patient/settings/_components/profile-image-field"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Loader } from "@/components/ui/loader"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type PatientProfileFormProps = {
  defaultValues: ProfileFormValues
  formKey?: number
  submitLabel?: string
  emailReadOnly?: boolean
  isSubmitting?: boolean
  onSubmit: (values: ProfileFormValues) => void
}

export default function PatientProfileForm({
  defaultValues,
  formKey = 0,
  submitLabel = "Save Profile",
  emailReadOnly = false,
  isSubmitting = false,
  onSubmit,
}: PatientProfileFormProps) {
  return (
    <FormModified
      key={formKey}
      schema={profileSchema}
      defaultValues={defaultValues}
      fieldsetProps={{ className: "space-y-6" }}
      onSubmit={onSubmit}
    >
      {({ components, methods }) => {
        const { Input: FormInput, Field } = components

        return (
          <>
            <ProfileImageField
              image={methods.watch("profileImage")}
              profile={{
                firstName: methods.watch("firstName"),
                lastName: methods.watch("lastName"),
              }}
              disabled={isSubmitting}
              onChange={(image) =>
                methods.setValue("profileImage", image, {
                  shouldDirty: true,
                })
              }
            />

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

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <FormInput
                name="email"
                label="Email"
                placeholder="Email address"
                type="email"
                readOnly={emailReadOnly}
                disabled={emailReadOnly}
                className={emailReadOnly ? "bg-muted/50" : undefined}
              />
              <FormInput
                name="phone"
                label="Phone"
                placeholder="Phone number"
                type="tel"
              />
              <Field name="gender" label="Gender">
                {(field) => (
                  <Select
                    value={field.value as string}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="bloodGroup" label="Blood Group">
                {(field) => (
                  <Select
                    value={field.value as string}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroupOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>

              <FormInput
                name="address"
                label="Address"
                placeholder="Street address, city, state"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader variant="button" /> : submitLabel}
              </Button>
            </div>
          </>
        )
      }}
    </FormModified>
  )
}
