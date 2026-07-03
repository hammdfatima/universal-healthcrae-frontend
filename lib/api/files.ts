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

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
