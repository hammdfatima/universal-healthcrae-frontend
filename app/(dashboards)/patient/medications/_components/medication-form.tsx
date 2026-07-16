"use client"

import Link from "next/link"
import { useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useWatch } from "react-hook-form"
import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import {
  defaultTimesForPerDay,
  type MedicationFormValues,
  medicationDefaultValues,
  medicationSchema,
} from "@/app/(dashboards)/patient/_lib/medications"
import DatePickerField from "@/components/date-picker-field"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import FormModified from "@/components/ui/form-modified"
import { Loader } from "@/components/ui/loader"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import TimePickerField from "@/components/ui/time-picker-field"
import { Typography } from "@/components/ui/typography"

type MedicationFormProps = {
  title: string
  description: string
  defaultValues?: MedicationFormValues
  onSubmit: (values: MedicationFormValues) => void
  submitLabel: string
  isSubmitting?: boolean
}

const TIMES_PER_DAY_OPTIONS = [1, 2, 3, 4, 5, 6]

function syncDoseTimes(
  methods: UseFormReturn<MedicationFormValues>,
  timesPerDay: number
) {
  const count = Math.min(6, Math.max(1, timesPerDay))
  const current = methods.getValues("timesOfDay") ?? []
  const next = defaultTimesForPerDay(count).map(
    (fallback, index) => current[index] || fallback
  )

  if (
    current.length === next.length &&
    current.every((time, index) => time === next[index])
  ) {
    return
  }

  methods.setValue("timesOfDay", next, {
    shouldDirty: true,
    shouldValidate: true,
  })
}

function ScheduleFields({
  methods,
}: {
  methods: UseFormReturn<MedicationFormValues>
}) {
  const timesPerDayRaw = useWatch({
    control: methods.control,
    name: "timesPerDay",
  })
  const timesOfDay =
    useWatch({
      control: methods.control,
      name: "timesOfDay",
    }) ?? []

  const timesPerDay = Math.min(
    6,
    Math.max(1, Number(timesPerDayRaw) || timesOfDay.length || 1)
  )

  useEffect(() => {
    syncDoseTimes(methods, timesPerDay)
  }, [timesPerDay, methods])

  const doseCount = Math.max(timesPerDay, timesOfDay.length || 0)

  return (
    <div className="space-y-5">
      <div className="max-w-md">
        <FormField
          control={methods.control}
          name="timesPerDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">
                How many times a day?
              </FormLabel>
              <FormControl>
                <Select
                  value={String(field.value ?? 1)}
                  onValueChange={(value) => {
                    const nextCount = Number.parseInt(value, 10)
                    field.onChange(nextCount)
                    syncDoseTimes(methods, nextCount)
                  }}
                >
                  <SelectTrigger className="w-full rounded-full">
                    <SelectValue placeholder="Select times per day" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMES_PER_DAY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option === 1
                          ? "1 time per day"
                          : `${option} times per day`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                We'll remind you at each dose time you set.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-3">
        <Typography
          variant="small"
          className="font-medium text-muted-foreground"
        >
          Dose times
        </Typography>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: doseCount }, (_, slot) => (
            <div key={`dose-${slot + 1}`} className="space-y-2">
              <Typography variant="small" className="text-muted-foreground">
                Dose {slot + 1}
              </Typography>
              <TimePickerField
                value={timesOfDay[slot] || ""}
                onChange={(time) => {
                  const next = [...(methods.getValues("timesOfDay") ?? [])]
                  const defaults = defaultTimesForPerDay(timesPerDay)
                  while (next.length < timesPerDay) {
                    next.push(defaults[next.length] || "08:00")
                  }
                  next[slot] = time
                  methods.setValue(
                    "timesOfDay",
                    next.slice(0, Math.max(timesPerDay, slot + 1)),
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    }
                  )
                }}
                placeholder="Select time"
              />
            </div>
          ))}
        </div>
        {methods.formState.errors.timesOfDay ? (
          <Typography variant="small" className="text-destructive">
            {methods.formState.errors.timesOfDay.message?.toString() ||
              "Set a time for every dose."}
          </Typography>
        ) : null}
      </div>
    </div>
  )
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
          {({ components, methods }) => {
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

                <ScheduleFields methods={methods} />

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
                    <Link href={healthRecordHref("medications")}>Close</Link>
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
