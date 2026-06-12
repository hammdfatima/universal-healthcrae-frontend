import { format, isValid, parse } from "date-fns"
import { z } from "zod"

export type LabResult = {
  id: string
  fileName: string
  testType: string
  testDate: string
  fileData: string
  fileMimeType: string
}

export const labResultSchema = z.object({
  fileName: z.string().min(1, "File name is required."),
  testType: z.string().min(1, "Test type is required."),
  testDate: z.date({ message: "Test date is required." }),
  fileData: z.string().min(1, "Please upload a lab report file."),
  fileMimeType: z.string().min(1, "Please upload a lab report file."),
})

export type LabResultFormValues = z.infer<typeof labResultSchema>

export const labResultDefaultValues: LabResultFormValues = {
  fileName: "",
  testType: "",
  testDate: undefined as unknown as Date,
  fileData: "",
  fileMimeType: "",
}

export const initialLabResults: LabResult[] = [
  {
    id: "1",
    fileName: "lipid-panel-march-2025.pdf",
    testType: "Lipid Panel",
    testDate: "03/12/2025",
    fileData: "",
    fileMimeType: "application/pdf",
  },
  {
    id: "2",
    fileName: "cbc-results.pdf",
    testType: "Complete Blood Count",
    testDate: "01/08/2025",
    fileData: "",
    fileMimeType: "application/pdf",
  },
  {
    id: "3",
    fileName: "thyroid-panel.pdf",
    testType: "Thyroid Panel",
    testDate: "11/20/2024",
    fileData: "",
    fileMimeType: "application/pdf",
  },
  {
    id: "4",
    fileName: "metabolic-panel.pdf",
    testType: "Metabolic Panel",
    testDate: "09/15/2024",
    fileData: "",
    fileMimeType: "application/pdf",
  },
  {
    id: "5",
    fileName: "urinalysis-report.pdf",
    testType: "Urinalysis",
    testDate: "06/02/2024",
    fileData: "",
    fileMimeType: "application/pdf",
  },
]

export const LAB_RESULTS_STORAGE_KEY = "uhc-lab-results"

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

export function getLabResultsFromStorage(): LabResult[] {
  if (typeof window === "undefined") return initialLabResults

  try {
    const stored = localStorage.getItem(LAB_RESULTS_STORAGE_KEY)
    if (!stored) return initialLabResults
    return JSON.parse(stored) as LabResult[]
  } catch {
    return initialLabResults
  }
}

export function saveLabResultsToStorage(results: LabResult[]) {
  localStorage.setItem(LAB_RESULTS_STORAGE_KEY, JSON.stringify(results))
}

export function getLabResultById(id: string): LabResult | undefined {
  return getLabResultsFromStorage().find((result) => result.id === id)
}

export function labResultToFormValues(result: LabResult): LabResultFormValues {
  return {
    fileName: result.fileName,
    testType: result.testType,
    testDate: parseLabDate(result.testDate) as Date,
    fileData: result.fileData,
    fileMimeType: result.fileMimeType,
  }
}

export function formValuesToLabResult(
  values: LabResultFormValues,
  id: string
): LabResult {
  return {
    id,
    fileName: values.fileName.trim(),
    testType: values.testType.trim(),
    testDate: formatLabDate(values.testDate),
    fileData: values.fileData,
    fileMimeType: values.fileMimeType,
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
