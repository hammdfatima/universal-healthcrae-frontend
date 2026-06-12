import { format, isValid, parse } from "date-fns"
import { z } from "zod"

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

export type ImagingResult = {
  id: string
  fileName: string
  testType: string
  scanType: string
  scanDate: string
  fileData: string
  fileMimeType: string
}

export const imagingResultSchema = z.object({
  fileName: z.string().min(1, "File name is required."),
  testType: z.string().min(1, "Test type is required."),
  scanType: z.string().min(1, "Scan type is required."),
  scanDate: z.date({ message: "Scan date is required." }),
  fileData: z.string().min(1, "Please upload an imaging file."),
  fileMimeType: z.string().min(1, "Please upload an imaging file."),
})

export type ImagingResultFormValues = z.infer<typeof imagingResultSchema>

export const imagingResultDefaultValues: ImagingResultFormValues = {
  fileName: "",
  testType: "",
  scanType: "",
  scanDate: undefined as unknown as Date,
  fileData: "",
  fileMimeType: "",
}

export const initialImagingResults: ImagingResult[] = [
  {
    id: "1",
    fileName: "chest-xray-march-2025.pdf",
    testType: "Diagnostic",
    scanType: "X-Ray",
    scanDate: "03/18/2025",
    fileData: "",
    fileMimeType: "application/pdf",
  },
  {
    id: "2",
    fileName: "brain-mri-report.pdf",
    testType: "Follow-up",
    scanType: "MRI",
    scanDate: "01/22/2025",
    fileData: "",
    fileMimeType: "application/pdf",
  },
  {
    id: "3",
    fileName: "abdominal-ct-scan.pdf",
    testType: "Emergency",
    scanType: "CT Scan",
    scanDate: "11/05/2024",
    fileData: "",
    fileMimeType: "application/pdf",
  },
]

export const IMAGING_RESULTS_STORAGE_KEY = "uhc-imaging-results"

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

export function getImagingResultsFromStorage(): ImagingResult[] {
  if (typeof window === "undefined") return initialImagingResults

  try {
    const stored = localStorage.getItem(IMAGING_RESULTS_STORAGE_KEY)
    if (!stored) return initialImagingResults
    return JSON.parse(stored) as ImagingResult[]
  } catch {
    return initialImagingResults
  }
}

export function saveImagingResultsToStorage(results: ImagingResult[]) {
  localStorage.setItem(IMAGING_RESULTS_STORAGE_KEY, JSON.stringify(results))
}

export function getImagingResultById(id: string): ImagingResult | undefined {
  return getImagingResultsFromStorage().find((result) => result.id === id)
}

export function imagingResultToFormValues(
  result: ImagingResult
): ImagingResultFormValues {
  return {
    fileName: result.fileName,
    testType: result.testType,
    scanType: result.scanType,
    scanDate: parseImagingDate(result.scanDate) as Date,
    fileData: result.fileData,
    fileMimeType: result.fileMimeType,
  }
}

export function formValuesToImagingResult(
  values: ImagingResultFormValues,
  id: string
): ImagingResult {
  return {
    id,
    fileName: values.fileName.trim(),
    testType: values.testType.trim(),
    scanType: values.scanType.trim(),
    scanDate: formatImagingDate(values.scanDate),
    fileData: values.fileData,
    fileMimeType: values.fileMimeType,
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

export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith("image/")
}

export function isPdfMimeType(mimeType: string): boolean {
  return mimeType === "application/pdf"
}
