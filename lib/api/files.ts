export type CloudinaryResourceType = "image" | "video" | "raw" | "auto"

export type UploadedFile = {
  publicId: string
  url: string
  secureUrl: string
  format: string | null
  resourceType: string
  bytes: number
  width: number | null
  height: number | null
  originalFilename: string
}

export type DeleteFilePayload = {
  publicId: string
  resourceType?: CloudinaryResourceType
}

export const FILES_API = {
  upload: "/files/upload",
  list: "/files",
  delete: "/files",
} as const

export const FILES_QUERY_KEYS = {
  list: ["files"] as const,
}

export const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
] as const

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
export const MAX_LAB_FILE_SIZE_BYTES = 5 * 1024 * 1024
export const MAX_IMAGING_FILE_SIZE_BYTES = 5 * 1024 * 1024

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type ApiResponse<T> = {
  message: string
  data: T
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  const { default: axios, isAxiosError } = await import("axios")
  const { env } = await import("@/env")
  const { buildRequestUrl } = await import("@/lib/utils")

  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await axios.post<ApiResponse<UploadedFile>>(
      buildRequestUrl(env.NEXT_PUBLIC_API_URL, FILES_API.upload),
      formData,
      {
        withCredentials: true,
      }
    )

    return response.data.data
  } catch (error) {
    const message = isAxiosError(error)
      ? (error.response?.data?.message as string | undefined)
      : undefined
    throw new Error(message ?? "Failed to upload file.")
  }
}
