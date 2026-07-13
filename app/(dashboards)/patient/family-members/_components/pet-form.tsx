"use client"

import { Plus, Trash2 } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import type { ReactNode } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Controller, useFieldArray } from "react-hook-form"

import {
  type PetFormValues,
  petDefaultValues,
  petSchema,
  sexOptions,
  speciesOptions,
} from "@/app/(dashboards)/patient/_lib/pets"
import DatePickerField from "@/components/date-picker-field"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Typography } from "@/components/ui/typography"
import type { FamilyMember } from "@/lib/api/family-members"

type PetFormProps = {
  title: string
  description: string
  defaultValues?: PetFormValues
  onSubmit: (values: PetFormValues) => void
  submitLabel: string
  isSubmitting?: boolean
  familyMembers: FamilyMember[]
  cancelHref?: Route
}

type PetFormFieldsProps = {
  // biome-ignore lint/suspicious/noExplicitAny: shared form component bag from FormModified
  components: any
  methods: UseFormReturn<PetFormValues>
  familyMembers: FamilyMember[]
  isSubmitting: boolean
  submitLabel: string
  cancelHref: Route
}

function PetFormFields({
  components,
  methods,
  familyMembers,
  isSubmitting,
  submitLabel,
  cancelHref,
}: PetFormFieldsProps) {
  const { Input: FormInput, Textarea: FormTextarea, Field } = components

  const medicationsArray = useFieldArray({
    control: methods.control,
    name: "medications",
  })
  const allergiesArray = useFieldArray({
    control: methods.control,
    name: "allergies",
  })
  const vaccinationsArray = useFieldArray({
    control: methods.control,
    name: "vaccinations",
  })

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput name="name" label="Pet Name" placeholder="Buddy" />
        <Field name="species" label="Species">
          {(field: { value: unknown; onChange: (value: unknown) => void }) => (
            <Select
              value={(field.value as string) || ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select species" />
              </SelectTrigger>
              <SelectContent>
                {speciesOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormInput name="breed" label="Breed" placeholder="Breed" />
        <Field name="sex" label="Sex">
          {(field: { value: unknown; onChange: (value: unknown) => void }) => (
            <Select
              value={(field.value as string) || ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                {sexOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
        <FormInput name="color" label="Color / Markings" placeholder="Color" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="dateOfBirth" label="Date of Birth (optional)">
          {(field: { value: unknown; onChange: (value: unknown) => void }) => (
            <DatePickerField
              value={(field.value as Date | null) ?? undefined}
              onChange={field.onChange}
              placeholder="MM/DD/YYYY"
            />
          )}
        </Field>
        <FormInput
          name="microchipId"
          label="Microchip ID"
          placeholder="Microchip ID"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          name="veterinaryClinic"
          label="Veterinary Clinic"
          placeholder="Clinic name"
        />
        <FormInput
          name="veterinaryPhone"
          label="Veterinary Phone"
          placeholder="(555) 000-0000"
        />
      </div>

      <FormTextarea
        name="veterinaryRecords"
        label="Veterinary Records"
        placeholder="Notes from visits, surgeries, chronic conditions..."
        rows={4}
      />

      <Field
        name="emergencyContactFamilyMemberId"
        label="Emergency Contact (family member)"
        description="Choose someone from your family members to contact for this pet."
      >
        {(field: { value: unknown; onChange: (value: unknown) => void }) => (
          <Select
            value={(field.value as string | null) ?? "none"}
            onValueChange={(value) =>
              field.onChange(value === "none" ? null : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select family member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {familyMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.firstName} {member.lastName} ({member.relationship})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>

      {familyMembers.length === 0 ? (
        <Typography variant="muted" className="text-sm">
          Add a family member first if you want to assign an emergency contact
          for this pet.
        </Typography>
      ) : null}

      <DynamicListSection
        title="Medications"
        emptyLabel="No medications added yet."
        addLabel="Add Medication"
        fields={medicationsArray.fields}
        onAdd={() =>
          medicationsArray.append({ name: "", dosage: "", notes: "" })
        }
        onRemove={medicationsArray.remove}
        renderRow={(index) => (
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              placeholder="Medication name"
              {...methods.register(`medications.${index}.name`)}
            />
            <Input
              placeholder="Dosage"
              {...methods.register(`medications.${index}.dosage`)}
            />
            <Input
              placeholder="Notes"
              {...methods.register(`medications.${index}.notes`)}
            />
          </div>
        )}
      />

      <DynamicListSection
        title="Allergies"
        emptyLabel="No allergies added yet."
        addLabel="Add Allergy"
        fields={allergiesArray.fields}
        onAdd={() =>
          allergiesArray.append({ name: "", reaction: "", notes: "" })
        }
        onRemove={allergiesArray.remove}
        renderRow={(index) => (
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              placeholder="Allergy"
              {...methods.register(`allergies.${index}.name`)}
            />
            <Input
              placeholder="Reaction"
              {...methods.register(`allergies.${index}.reaction`)}
            />
            <Input
              placeholder="Notes"
              {...methods.register(`allergies.${index}.notes`)}
            />
          </div>
        )}
      />

      <DynamicListSection
        title="Vaccinations"
        emptyLabel="No vaccinations added yet."
        addLabel="Add Vaccination"
        fields={vaccinationsArray.fields}
        onAdd={() =>
          vaccinationsArray.append({
            name: "",
            dateGiven: null,
            nextDue: null,
            notes: "",
          })
        }
        onRemove={vaccinationsArray.remove}
        renderRow={(index) => (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Vaccine name"
              {...methods.register(`vaccinations.${index}.name`)}
            />
            <Controller
              control={methods.control}
              name={`vaccinations.${index}.dateGiven`}
              render={({ field }) => (
                <DatePickerField
                  value={field.value instanceof Date ? field.value : undefined}
                  onChange={(date) => field.onChange(date ?? null)}
                  placeholder="Date given"
                />
              )}
            />
            <Controller
              control={methods.control}
              name={`vaccinations.${index}.nextDue`}
              render={({ field }) => (
                <DatePickerField
                  value={field.value instanceof Date ? field.value : undefined}
                  onChange={(date) => field.onChange(date ?? null)}
                  placeholder="Next due"
                  minDate={
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      new Date().getDate() + 1
                    )
                  }
                />
              )}
            />
            <Input
              placeholder="Notes"
              {...methods.register(`vaccinations.${index}.notes`)}
            />
          </div>
        )}
      />

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader variant="button" label="Saving..." />
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </>
  )
}

export default function PetForm({
  title,
  description,
  defaultValues = petDefaultValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  familyMembers,
  cancelHref = "/patient/family-members?tab=pets" as Route,
}: PetFormProps) {
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
          schema={petSchema}
          defaultValues={defaultValues}
          fieldsetProps={{ className: "space-y-6" }}
          onSubmit={onSubmit}
        >
          {({ components, methods }) => (
            <PetFormFields
              components={components}
              methods={methods}
              familyMembers={familyMembers}
              isSubmitting={isSubmitting}
              submitLabel={submitLabel}
              cancelHref={cancelHref}
            />
          )}
        </FormModified>
      </div>
    </div>
  )
}

function DynamicListSection({
  title,
  emptyLabel,
  addLabel,
  fields,
  onAdd,
  onRemove,
  renderRow,
}: {
  title: string
  emptyLabel: string
  addLabel: string
  fields: { id: string }[]
  onAdd: () => void
  onRemove: (index: number) => void
  renderRow: (index: number) => ReactNode
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <Typography as="h2" variant="h5">
          {title}
        </Typography>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="size-4" aria-hidden />
          {addLabel}
        </Button>
      </div>

      {fields.length === 0 ? (
        <Typography variant="muted" className="text-sm">
          {emptyLabel}
        </Typography>
      ) : (
        <ul className="space-y-3">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className="flex flex-col gap-2 rounded-lg border border-border/50 bg-background p-3 sm:flex-row sm:items-start"
            >
              <div className="min-w-0 flex-1">{renderRow(index)}</div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive hover:text-destructive"
                aria-label={`Remove ${title} row`}
                onClick={() => onRemove(index)}
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
