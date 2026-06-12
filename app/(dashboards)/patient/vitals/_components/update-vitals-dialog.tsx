"use client"

import { Plus, X } from "lucide-react"
import { type UseFormReturn, useFieldArray } from "react-hook-form"

import {
  formatVitalsTimestamp,
  formValuesToVitals,
  getVitalsFromStorage,
  type PatientVitals,
  saveVitalsToStorage,
  standardVitalFields,
  type VitalsFormValues,
  vitalsDefaultValues,
  vitalsSchema,
  vitalsToFormValues,
} from "@/app/(dashboards)/patient/_lib/vitals"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FormModified from "@/components/ui/form-modified"
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

type UpdateVitalsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vitals: PatientVitals
  onSaved: (vitals: PatientVitals) => void
}

function CustomFieldsEditor({
  methods,
}: {
  methods: UseFormReturn<VitalsFormValues>
}) {
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "customFields",
  })

  return (
    <div className="space-y-3 border-t border-border/60 pt-5">
      <Typography variant="small" className="font-semibold">
        Additional Fields
      </Typography>

      {fields.length > 0 ? (
        <div className="space-y-2">
          <div className="hidden gap-3 sm:grid sm:grid-cols-[1fr_1fr_auto]">
            <Typography variant="muted" className="text-xs font-medium">
              Field Name
            </Typography>
            <Typography variant="muted" className="text-xs font-medium">
              Value
            </Typography>
            <span className="size-9" aria-hidden />
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-start"
            >
              <input
                type="hidden"
                {...methods.register(`customFields.${index}.id`)}
              />
              <Input
                placeholder="Enter field name"
                {...methods.register(`customFields.${index}.fieldName`)}
              />
              <Input
                placeholder="Enter value"
                {...methods.register(`customFields.${index}.value`)}
              />
              <Button
                type="button"
                variant="ghost"
                className="size-9 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remove field"
                onClick={() => remove(index)}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <Button
        type="button"
        variant="outline"
        className="gap-1.5"
        onClick={() =>
          append({ id: crypto.randomUUID(), fieldName: "", value: "" })
        }
      >
        <Plus className="size-4" aria-hidden />
        Add More
      </Button>
    </div>
  )
}

export default function UpdateVitalsDialog({
  open,
  onOpenChange,
  vitals,
  onSaved,
}: UpdateVitalsDialogProps) {
  const { toastSuccess } = useToast()
  const formKey = open ? vitals.updatedOn : "closed"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
          <DialogTitle>Update Vitals</DialogTitle>
          <DialogDescription>
            Record your latest measurements and any additional custom vitals.
          </DialogDescription>
        </DialogHeader>

        <div className="thin-scrollbar overflow-y-auto px-6 py-5">
          <FormModified
            key={formKey}
            schema={vitalsSchema}
            defaultValues={
              vitals.addedOn
                ? vitalsToFormValues(vitals)
                : {
                    ...vitalsDefaultValues,
                    ...vitalsToFormValues(vitals),
                  }
            }
            fieldsetProps={{ className: "space-y-5" }}
            onSubmit={(values) => {
              const existing = getVitalsFromStorage()
              const now = new Date()
              const next: PatientVitals = {
                ...formValuesToVitals(values),
                addedOn: existing.addedOn || formatVitalsTimestamp(now),
                updatedOn: formatVitalsTimestamp(now),
              }

              saveVitalsToStorage(next)
              onSaved(next)
              onOpenChange(false)
              toastSuccess("Vitals updated successfully.")
            }}
          >
            {({ components, methods }) => {
              const { Input: FormInput } = components

              return (
                <>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {standardVitalFields.map((field) => (
                      <FormInput
                        key={field.key}
                        name={field.key}
                        label={field.label}
                        placeholder={field.placeholder}
                      />
                    ))}
                  </div>

                  <CustomFieldsEditor methods={methods} />

                  <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Close
                    </Button>
                    <Button type="submit">Save Vitals</Button>
                  </div>
                </>
              )
            }}
          </FormModified>
        </div>
      </DialogContent>
    </Dialog>
  )
}
