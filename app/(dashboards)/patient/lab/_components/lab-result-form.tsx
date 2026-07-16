"use client"

import Link from "next/link"
import { useRef } from "react"
import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import {
  type LabResultFormValues,
  LOCAL_FILE_SENTINEL,
  labResultDefaultValues,
  labResultSchema,
} from "@/app/(dashboards)/patient/_lib/lab"
import DatePickerField from "@/components/date-picker-field"
import FileUploadField from "@/components/file-upload-field"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import { MAX_LAB_FILE_SIZE_BYTES } from "@/lib/api/files"

type LabResultFormProps = {
  title: string
  description: string
  defaultValues?: LabResultFormValues
  onSubmit: (
    values: LabResultFormValues,
    selectedFile: File | null
  ) => void | Promise<void>
  submitLabel: string
  isSubmitting?: boolean
}

export default function LabResultForm({
  title,
  description,
  defaultValues = labResultDefaultValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: LabResultFormProps) {
  const selectedFileRef = useRef<File | null>(null)

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
          onSubmit={(values) => onSubmit(values, selectedFileRef.current)}
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
                      maxDate={new Date()}
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
                    hint="PDF, PNG, JPG, or WEBP"
                    maxSizeBytes={MAX_LAB_FILE_SIZE_BYTES}
                    localFileSentinel={LOCAL_FILE_SENTINEL}
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
                    onFileSelect={(file) => {
                      selectedFileRef.current = file
                    }}
                    onChange={(file) => {
                      if (!file) {
                        selectedFileRef.current = null
                        methods.setValue("fileData", "", {
                          shouldValidate: true,
                        })
                        methods.setValue("fileMimeType", "", {
                          shouldValidate: true,
                        })
                        methods.setValue("filePublicId", "", {
                          shouldValidate: true,
                        })
                        methods.setValue("fileResourceType", "", {
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
                      methods.setValue("filePublicId", "", {
                        shouldValidate: true,
                      })
                      methods.setValue("fileResourceType", "", {
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
                    <Link href={healthRecordHref("laboratory")}>Close</Link>
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
