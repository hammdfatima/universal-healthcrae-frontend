export type ImagingResult = {
  id: string
  fileName: string
  testType: string
  scanType: string
  scanDate: string
  fileUrl: string
  filePublicId: string
  fileMimeType: string
  fileResourceType: string | null
  createdAt: string
  updatedAt: string
}

export type ImagingResultsListResponse = {
  imagingResults: ImagingResult[]
}

export type CreateImagingResultPayload = {
  fileName: string
  testType: string
  scanType: string
  scanDate: string
  fileUrl: string
  filePublicId: string
  fileMimeType: string
  fileResourceType?: string
}

export type UpdateImagingResultPayload = CreateImagingResultPayload

export const IMAGING_RESULTS_API = {
  list: "/imaging-results",
  create: "/imaging-results",
  update: (id: string) => `/imaging-results/${id}`,
  delete: (id: string) => `/imaging-results/${id}`,
} as const

export const IMAGING_RESULTS_QUERY_KEYS = {
  list: ["imaging-results", "list"] as const,
}
