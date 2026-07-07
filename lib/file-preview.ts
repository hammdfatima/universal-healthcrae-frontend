export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith("image/")
}

export function isPdfMimeType(mimeType: string, fileName?: string): boolean {
  if (mimeType.startsWith("image/")) {
    return false
  }

  if (
    mimeType === "application/pdf" ||
    mimeType.toLowerCase().includes("pdf")
  ) {
    return true
  }

  return fileName?.toLowerCase().endsWith(".pdf") ?? false
}

export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".")
  if (parts.length < 2) return "FILE"
  return parts.at(-1)?.toUpperCase() ?? "FILE"
}

export function resolvePreviewSource(
  fileData: string,
  localFileSentinel: string,
  objectUrl?: string | null
): string | null {
  if (!fileData) return null

  if (fileData === localFileSentinel) {
    return objectUrl ?? null
  }

  if (
    fileData.startsWith("data:") ||
    fileData.startsWith("http://") ||
    fileData.startsWith("https://")
  ) {
    return fileData
  }

  return objectUrl ?? null
}

/** Build an embeddable PDF preview URL for Cloudinary and local files. */
export function getPdfPreviewUrl(url: string): string {
  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return url
  }

  if (!url.includes("cloudinary.com")) {
    return url
  }

  // PDFs uploaded as image already have a viewable delivery URL.
  if (url.includes("/image/upload/")) {
    return url
  }

  // Legacy raw PDFs cannot be remapped to /image/upload/...pdf (404).
  // Google Docs viewer embeds the raw file for in-app preview.
  if (url.includes("/raw/upload/")) {
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
  }

  return url
}

export function getPdfDownloadUrl(url: string): string {
  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return url
  }

  if (!url.includes("cloudinary.com")) {
    return url
  }

  if (url.includes("/image/upload/")) {
    return url.replace("/image/upload/", "/image/upload/fl_attachment/")
  }

  if (url.includes("/raw/upload/")) {
    return url.replace("/raw/upload/", "/raw/upload/fl_attachment/")
  }

  return url
}

export function getPdfOpenUrl(url: string): string {
  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return url
  }

  if (url.includes("cloudinary.com") && url.includes("/raw/upload/")) {
    return url
  }

  return getPdfPreviewUrl(url)
}
