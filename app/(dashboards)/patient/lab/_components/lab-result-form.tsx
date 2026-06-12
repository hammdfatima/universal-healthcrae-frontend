"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  type LabResultFormValues,
  labResultDefaultValues,
  labResultSchema,
} from "@/app/(dashboards)/patient/_lib/lab"
import DatePickerField from "@/components/date-picker-field"
import FileUploadField from "@/components/file-upload-field"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

type LabResultFormProps = {
  title: string
  description: string
  defaultValues?: LabResultFormValues
  onSubmit: (values: LabResultFormValues) => void
  submitLabel: string
}

export default function LabResultForm({
  title,
  description,
  defaultValues = labResultDefaultValues,
  onSubmit,
  submitLabel,
}: LabResultFormProps) {
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
          schema={labResultSchema}
          defaultValues={defaultValues}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={(values) => {
            onSubmit(values)
            toastSuccess(
              submitLabel === "Save"
                ? "Lab result added successfully."
                : "Lab result updated successfully."
            )
            router.push("/patient/lab")
          }}
        >
          {({ components, methods }) => {
            const { Input: FormInput, Field } = components

            return (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    name="fileName"
                    label="File Name"
                    placeholder="File name"
                  />
                  <FormInput
                    name="testType"
                    label="Test Type"
                    placeholder="e.g. Lipid Panel, CBC"
                  />
                </div>

                <Field name="testDate" label="Test Date">
                  {(field) => (
                    <DatePickerField
                      value={field.value as Date | undefined}
                      onChange={field.onChange}
                      placeholder="MM/DD/YYYY"
                    />
                  )}
                </Field>

                <div className="space-y-2">
                  <Typography variant="small" className="font-medium">
                    Upload File
                  </Typography>
                  <FileUploadField
                    title="Upload lab report"
                    description="Drag and drop your lab report here, or browse from your device"
                    hint="PDF, PNG, JPG, or WEBP · Max recommended 10 MB"
                    value={
                      methods.watch("fileData")
                        ? {
                            fileData: methods.watch("fileData"),
                            fileName:
                              methods.watch("fileName") || "Uploaded file",
                            fileMimeType: methods.watch("fileMimeType"),
                          }
                        : null
                    }
                    onChange={(file) => {
                      if (!file) {
                        methods.setValue("fileData", "", {
                          shouldValidate: true,
                        })
                        methods.setValue("fileMimeType", "", {
                          shouldValidate: true,
                        })
                        return
                      }

                      methods.setValue("fileData", file.fileData, {
                        shouldValidate: true,
                      })
                      methods.setValue("fileMimeType", file.fileMimeType, {
                        shouldValidate: true,
                      })

                      if (!methods.getValues("fileName").trim()) {
                        methods.setValue("fileName", file.fileName, {
                          shouldValidate: true,
                        })
                      }
                    }}
                  />
                  {methods.formState.errors.fileData ? (
                    <Typography
                      variant="muted"
                      className="text-sm text-destructive"
                    >
                      {methods.formState.errors.fileData.message}
                    </Typography>
                  ) : null}
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/patient/lab">Close</Link>
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
