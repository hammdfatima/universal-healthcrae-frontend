import { format, isAfter, isValid, parse, startOfDay } from "date-fns"
import { z } from "zod"
import { MAX_LAB_FILE_SIZE_BYTES, uploadFile } from "@/lib/api/files"
import type { CreateLabResultPayload, LabResult } from "@/lib/api/lab-results"

export type { LabResult } from "@/lib/api/lab-results"

export const LOCAL_FILE_SENTINEL = "local-file-selected"

function isFutureDate(date: Date): boolean {
  return isAfter(startOfDay(date), startOfDay(new Date()))
}

export const labResultSchema = z.object({
  fileName: z.string().min(1, "File name is required."),
  testType: z.string().min(1, "Test type is required."),
  testDate: z
    .date({ message: "Test date is required." })
    .refine((date) => !isFutureDate(date), {
      message: "Test date cannot be in the future.",
    }),
  fileData: z.string().min(1, "Please upload a lab report file."),
  fileMimeType: z.string().min(1, "Please upload a lab report file."),
  filePublicId: z.string().optional(),
  fileResourceType: z.string().optional(),
})

export type LabResultFormValues = z.infer<typeof labResultSchema>

export const labResultDefaultValues: LabResultFormValues = {
  fileName: "",
  testType: "",
  testDate: undefined as unknown as Date,
  fileData: "",
  fileMimeType: "",
  filePublicId: "",
  fileResourceType: "",
}

export function formatLabDate(date: Date): string {
  return format(date, "MM/dd/yyyy")
}

export function parseLabDate(
  value: string | null | undefined
): Date | undefined {
  if (!value) return undefined
  const parsed = parse(value, "MM/dd/yyyy", new Date())
  return isValid(parsed) ? parsed : undefined
}

export function labResultToFormValues(result: LabResult): LabResultFormValues {
  return {
    fileName: result.fileName,
    testType: result.testType,
    testDate: parseLabDate(result.testDate) as Date,
    fileData: result.fileUrl,
    fileMimeType: result.fileMimeType,
    filePublicId: result.filePublicId,
    fileResourceType: result.fileResourceType ?? "",
  }
}

export function formValuesToPayload(
  values: LabResultFormValues,
  file: {
    fileUrl: string
    filePublicId: string
    fileMimeType: string
    fileResourceType?: string
  }
): CreateLabResultPayload {
  return {
    fileName: values.fileName.trim(),
    testType: values.testType.trim(),
    testDate: formatLabDate(values.testDate),
    fileUrl: file.fileUrl,
    filePublicId: file.filePublicId,
    fileMimeType: file.fileMimeType,
    fileResourceType: file.fileResourceType,
  }
}

export function getTestTypeFilterOptions(results: LabResult[]) {
  const types = [...new Set(results.map((result) => result.testType))]
  return types.map((type) => ({ label: type, value: type }))
}

export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith("image/")
}

export function isPdfMimeType(mimeType: string): boolean {
  return mimeType === "application/pdf"
}

export function getLabResultFileSource(result: LabResult): string {
  return result.fileUrl
}

export function isNewFileUpload(fileData: string): boolean {
  return fileData.startsWith("data:") || fileData === LOCAL_FILE_SENTINEL
}

export function getUploadErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return "Failed to upload lab report file."
}

export function dataUrlToFile(
  dataUrl: string,
  fileName: string,
  mimeType: string
): File {
  const [header, base64] = dataUrl.split(",")
  const mime =
    mimeType || header.match(/data:(.*?);/)?.[1] || "application/octet-stream"
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new File([bytes], fileName, { type: mime })
}

export async function resolveLabResultFile(
  values: LabResultFormValues,
  selectedFile?: File | null
) {
  if (selectedFile) {
    if (selectedFile.size > MAX_LAB_FILE_SIZE_BYTES) {
      throw new Error("File size exceeds the 5MB limit.")
    }

    const uploaded = await uploadFile(selectedFile)

    return {
      fileUrl: uploaded.secureUrl,
      filePublicId: uploaded.publicId,
      fileMimeType: selectedFile.type || values.fileMimeType,
      fileResourceType: uploaded.resourceType,
    }
  }

  if (isNewFileUpload(values.fileData) && values.fileData.startsWith("data:")) {
    const file = dataUrlToFile(
      values.fileData,
      values.fileName,
      values.fileMimeType
    )

    if (file.size > MAX_LAB_FILE_SIZE_BYTES) {
      throw new Error("File size exceeds the 5MB limit.")
    }

    const uploaded = await uploadFile(file)

    return {
      fileUrl: uploaded.secureUrl,
      filePublicId: uploaded.publicId,
      fileMimeType: values.fileMimeType,
      fileResourceType: uploaded.resourceType,
    }
  }

  if (!values.filePublicId) {
    throw new Error("Missing file reference.")
  }

  return {
    fileUrl: values.fileData,
    filePublicId: values.filePublicId,
    fileMimeType: values.fileMimeType,
    fileResourceType: values.fileResourceType || undefined,
  }
}
