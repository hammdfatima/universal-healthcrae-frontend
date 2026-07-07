export type LabResult = {
  id: string
  fileName: string
  testType: string
  testDate: string
  fileUrl: string
  filePublicId: string
  fileMimeType: string
  fileResourceType: string | null
  createdAt: string
  updatedAt: string
}

export type LabResultsListResponse = {
  labResults: LabResult[]
}

export type CreateLabResultPayload = {
  fileName: string
  testType: string
  testDate: string
  fileUrl: string
  filePublicId: string
  fileMimeType: string
  fileResourceType?: string
}

export type UpdateLabResultPayload = CreateLabResultPayload

export const LAB_RESULTS_API = {
  list: "/lab-results",
  create: "/lab-results",
  update: (id: string) => `/lab-results/${id}`,
  delete: (id: string) => `/lab-results/${id}`,
} as const

export const LAB_RESULTS_QUERY_KEYS = {
  list: ["lab-results", "list"] as const,
}
