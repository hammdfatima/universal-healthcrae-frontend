"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  type ImagingResultFormValues,
  imagingResultDefaultValues,
  imagingResultSchema,
  imagingScanTypeOptions,
  imagingTestTypeOptions,
} from "@/app/(dashboards)/patient/_lib/imaging"
import DatePickerField from "@/components/date-picker-field"
import FileUploadField from "@/components/file-upload-field"
import { Button } from "@/components/ui/button"
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

type ImagingResultFormProps = {
  title: string
  description: string
  defaultValues?: ImagingResultFormValues
  onSubmit: (values: ImagingResultFormValues) => void
  submitLabel: string
}

export default function ImagingResultForm({
  title,
  description,
  defaultValues = imagingResultDefaultValues,
  onSubmit,
  submitLabel,
}: ImagingResultFormProps) {
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
          schema={imagingResultSchema}
          defaultValues={defaultValues}
          fieldsetProps={{ className: "space-y-5" }}
          onSubmit={(values) => {
            onSubmit(values)
            toastSuccess(
              submitLabel === "Save"
                ? "Imaging record added successfully."
                : "Imaging record updated successfully."
            )
            router.push("/patient/imaging")
          }}
        >
          {({ components, methods }) => {
            const { Input: FormInput, Field } = components

            return (
              <>
                <FormInput
                  name="fileName"
                  label="File Name"
                  placeholder="File name"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field name="testType" label="Test Type">
                    {(field) => (
                      <Select
                        value={field.value as string}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select test type" />
                        </SelectTrigger>
                        <SelectContent>
                          {imagingTestTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>

                  <Field name="scanType" label="Scan Type">
                    {(field) => (
                      <Select
                        value={field.value as string}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select scan type" />
                        </SelectTrigger>
                        <SelectContent>
                          {imagingScanTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                </div>

                <Field name="scanDate" label="Scan Date">
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
                    title="Upload imaging scan"
                    description="Drag and drop your scan file here, or browse from your device"
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
                    <Link href="/patient/imaging">Close</Link>
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
