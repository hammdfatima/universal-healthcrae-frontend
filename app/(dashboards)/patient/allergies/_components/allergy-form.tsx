"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { type ComponentType, useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useWatch } from "react-hook-form"

import {
  ALLERGY_TYPE_FOOD,
  type AllergyFormValues,
  allergyDefaultValues,
  allergySchema,
  allergyTypeOptions,
  foodTriggerOptions,
  natureOptions,
  symptomOptions,
} from "@/app/(dashboards)/patient/_lib/allergies"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { FormFieldProps } from "@/components/ui/form-modified"
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
import { cn } from "@/lib/utils"

type AllergyFormProps = {
  title: string
  description: string
  defaultValues?: AllergyFormValues
  onSubmit: (values: AllergyFormValues) => void
  submitLabel: string
}

type FormFieldsProps = {
  methods: UseFormReturn<AllergyFormValues>
  Field: ComponentType<Omit<FormFieldProps<AllergyFormValues>, "control">>
  submitLabel: string
}

function CheckboxGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[]
  value: string[]
  onChange: (next: string[]) => void
}) {
  return (
    <div className="thin-scrollbar grid max-h-64 gap-2 sm:grid-cols-4">
      {options.map((option) => {
        const checked = value.includes(option)
        const inputId = option.replace(/\s+/g, "-").toLowerCase()

        return (
          <label
            key={option}
            htmlFor={inputId}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-full border border-border/60 bg-muted/20 px-3 py-2.5 transition-colors hover:bg-muted/40",
              checked && "border-primary/30 bg-primary/5"
            )}
          >
            <Checkbox
              id={inputId}
              checked={checked}
              className="mt-0.5"
              onCheckedChange={(isChecked) => {
                if (isChecked) onChange([...value, option])
                else onChange(value.filter((item) => item !== option))
              }}
            />
            <span className="text-sm leading-snug">{option}</span>
          </label>
        )
      })}
    </div>
  )
}

function AllergyFormFields({ methods, Field, submitLabel }: FormFieldsProps) {
  const allergyType = useWatch({
    control: methods.control,
    name: "allergyType",
  })

  useEffect(() => {
    if (allergyType !== ALLERGY_TYPE_FOOD) {
      methods.setValue("triggers", [], { shouldValidate: true })
    }
  }, [allergyType, methods])

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="allergyType" label="Select Allergy">
          {(field) => (
            <Select
              value={field.value as string}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select allergy type" />
              </SelectTrigger>
              <SelectContent>
                {allergyTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>

        <Field name="nature" label="Nature">
          {(field) => (
            <Select
              value={field.value as string}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                {natureOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
      </div>

      <div className="space-y-3">
        <Typography variant="small" className="font-semibold">
          Symptoms
        </Typography>
        <Field name="symptoms">
          {(field) => (
            <CheckboxGroup
              options={symptomOptions}
              value={(field.value as string[]) ?? []}
              onChange={field.onChange}
            />
          )}
        </Field>
      </div>

      {allergyType === ALLERGY_TYPE_FOOD ? (
        <div className="space-y-3">
          <Typography variant="small" className="font-semibold">
            Triggers
          </Typography>
          <Field name="triggers">
            {(field) => (
              <CheckboxGroup
                options={foodTriggerOptions}
                value={(field.value as string[]) ?? []}
                onChange={field.onChange}
              />
            )}
          </Field>
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" asChild>
          <Link href="/patient/allergies">Close</Link>
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </>
  )
}

export default function AllergyForm({
  title,
  description,
  defaultValues = allergyDefaultValues,
  onSubmit,
  submitLabel,
}: AllergyFormProps) {
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
          schema={allergySchema}
          defaultValues={defaultValues}
          fieldsetProps={{ className: "space-y-6" }}
          onSubmit={(values) => {
            onSubmit(values)
            toastSuccess(
              submitLabel === "Save"
                ? "Allergy added successfully."
                : "Allergy updated successfully."
            )
            router.push("/patient/allergies")
          }}
        >
          {({ components, methods }) => (
            <AllergyFormFields
              methods={methods}
              Field={components.Field}
              submitLabel={submitLabel}
            />
          )}
        </FormModified>
      </div>
    </div>
  )
}
