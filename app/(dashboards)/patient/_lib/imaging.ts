import { format, isAfter, isValid, parse, startOfDay } from "date-fns"
import { z } from "zod"
import { MAX_IMAGING_FILE_SIZE_BYTES, uploadFile } from "@/lib/api/files"
import type {
  CreateImagingResultPayload,
  ImagingResult,
} from "@/lib/api/imaging-results"

export type { ImagingResult } from "@/lib/api/imaging-results"

export const imagingTestTypeOptions = [
  { label: "Diagnostic", value: "Diagnostic" },
  { label: "Screening", value: "Screening" },
  { label: "Follow-up", value: "Follow-up" },
  { label: "Routine", value: "Routine" },
  { label: "Pre-operative", value: "Pre-operative" },
  { label: "Emergency", value: "Emergency" },
] as const

export const imagingScanTypeOptions = [
  { label: "X-Ray", value: "X-Ray" },
  { label: "MRI", value: "MRI" },
  { label: "CT Scan", value: "CT Scan" },
  { label: "Ultrasound", value: "Ultrasound" },
  { label: "PET Scan", value: "PET Scan" },
  { label: "Mammography", value: "Mammography" },
  { label: "DEXA Scan", value: "DEXA Scan" },
  { label: "Fluoroscopy", value: "Fluoroscopy" },
  { label: "Nuclear Medicine", value: "Nuclear Medicine" },
] as const

export const LOCAL_FILE_SENTINEL = "local-file-selected"

function isFutureDate(date: Date): boolean {
  return isAfter(startOfDay(date), startOfDay(new Date()))
}

export const imagingResultSchema = z.object({
  fileName: z.string().min(1, "File name is required."),
  testType: z.string().min(1, "Test type is required."),
  scanType: z.string().min(1, "Scan type is required."),
  scanDate: z
    .date({ message: "Scan date is required." })
    .refine((date) => !isFutureDate(date), {
      message: "Scan date cannot be in the future.",
    }),
  fileData: z.string().min(1, "Please upload an imaging file."),
  fileMimeType: z.string().min(1, "Please upload an imaging file."),
  filePublicId: z.string().optional(),
  fileResourceType: z.string().optional(),
})

export type ImagingResultFormValues = z.infer<typeof imagingResultSchema>

export const imagingResultDefaultValues: ImagingResultFormValues = {
  fileName: "",
  testType: "",
  scanType: "",
  scanDate: undefined as unknown as Date,
  fileData: "",
  fileMimeType: "",
  filePublicId: "",
  fileResourceType: "",
}

export function formatImagingDate(date: Date): string {
  return format(date, "MM/dd/yyyy")
}

export function parseImagingDate(
  value: string | null | undefined
): Date | undefined {
  if (!value) return undefined
  const parsed = parse(value, "MM/dd/yyyy", new Date())
  return isValid(parsed) ? parsed : undefined
}

export function imagingResultToFormValues(
  result: ImagingResult
): ImagingResultFormValues {
  return {
    fileName: result.fileName,
    testType: result.testType,
    scanType: result.scanType,
    scanDate: parseImagingDate(result.scanDate) as Date,
    fileData: result.fileUrl,
    fileMimeType: result.fileMimeType,
    filePublicId: result.filePublicId,
    fileResourceType: result.fileResourceType ?? "",
  }
}

export function formValuesToPayload(
  values: ImagingResultFormValues,
  file: {
    fileUrl: string
    filePublicId: string
    fileMimeType: string
    fileResourceType?: string
  }
): CreateImagingResultPayload {
  return {
    fileName: values.fileName.trim(),
    testType: values.testType.trim(),
    scanType: values.scanType.trim(),
    scanDate: formatImagingDate(values.scanDate),
    fileUrl: file.fileUrl,
    filePublicId: file.filePublicId,
    fileMimeType: file.fileMimeType,
    fileResourceType: file.fileResourceType,
  }
}

export function getImagingTestTypeFilterOptions(results: ImagingResult[]) {
  const types = [...new Set(results.map((result) => result.testType))]
  return types.map((type) => ({ label: type, value: type }))
}

export function getImagingScanTypeFilterOptions(results: ImagingResult[]) {
  const types = [...new Set(results.map((result) => result.scanType))]
  return types.map((type) => ({ label: type, value: type }))
}

export function getImagingResultFileSource(result: ImagingResult): string {
  return result.fileUrl
}

export function isNewFileUpload(fileData: string): boolean {
  return fileData.startsWith("data:") || fileData === LOCAL_FILE_SENTINEL
}

export function getUploadErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return "Failed to upload imaging file."
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

export async function resolveImagingResultFile(
  values: ImagingResultFormValues,
  selectedFile?: File | null
) {
  if (selectedFile) {
    if (selectedFile.size > MAX_IMAGING_FILE_SIZE_BYTES) {
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

    if (file.size > MAX_IMAGING_FILE_SIZE_BYTES) {
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
