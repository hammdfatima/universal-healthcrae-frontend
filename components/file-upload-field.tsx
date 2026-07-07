"use client"

import { FileUp, Replace, Upload, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import FilePreviewCard from "@/components/file-preview-card"
import FilePreviewDialog from "@/components/file-preview-dialog"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { formatFileSize, MAX_FILE_SIZE_BYTES } from "@/lib/api/files"
import { resolvePreviewSource } from "@/lib/file-preview"
import { cn } from "@/lib/utils"

export type UploadedFileValue = {
  fileData: string
  fileName: string
  fileMimeType: string
}

type FileUploadFieldProps = {
  value?: UploadedFileValue | null
  onChange: (file: UploadedFileValue | null) => void
  onFileSelect?: (file: File | null) => void
  accept?: string
  disabled?: boolean
  id?: string
  title?: string
  description?: string
  hint?: string
  uploadedHint?: string
  maxSizeBytes?: number
}

function isPdfFile(file: File): boolean {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  )
}

function readFile(
  file: File,
  onChange: (value: UploadedFileValue) => void,
  localFileSentinel: string,
  onObjectUrl: (url: string | null) => void
) {
  if (isPdfFile(file)) {
    onObjectUrl(URL.createObjectURL(file))
    onChange({
      fileData: localFileSentinel,
      fileName: file.name,
      fileMimeType: file.type || "application/pdf",
    })
    return
  }

  onObjectUrl(null)
  const reader = new FileReader()
  reader.onload = () => {
    onChange({
      fileData: reader.result as string,
      fileName: file.name,
      fileMimeType: file.type || "application/octet-stream",
    })
  }
  reader.readAsDataURL(file)
}

export default function FileUploadField({
  value,
  onChange,
  onFileSelect,
  accept = ".pdf,.png,.jpg,.jpeg,.webp",
  disabled,
  id,
  title = "Upload file",
  description = "Drag and drop your file here, or browse from your device",
  hint = "Supports PDF, PNG, JPG, and WEBP",
  uploadedHint = "Ready to save with this record",
  maxSizeBytes = MAX_FILE_SIZE_BYTES,
  localFileSentinel = "local-file-selected",
}: FileUploadFieldProps & { localFileSentinel?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [sizeError, setSizeError] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  function revokeObjectUrl(url: string | null) {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url)
    }
  }

  useEffect(() => {
    return () => {
      if (objectUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [objectUrl])

  function handleSelectedFile(file: File | undefined) {
    if (!file || disabled) return

    if (file.size > maxSizeBytes) {
      setSizeError(
        `File is too large (${formatFileSize(file.size)}). Maximum size is ${formatFileSize(maxSizeBytes)}.`
      )
      onFileSelect?.(null)
      return
    }

    setSizeError(null)
    revokeObjectUrl(objectUrl)
    onFileSelect?.(file)
    readFile(file, onChange, localFileSentinel, setObjectUrl)
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    handleSelectedFile(event.target.files?.[0])
    event.target.value = ""
  }

  function handleDragOver(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  function handleDragLeave(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDragging(false)
    if (disabled) return
    handleSelectedFile(event.dataTransfer.files?.[0])
  }

  function openFilePicker() {
    if (!disabled) inputRef.current?.click()
  }

  function clearFile() {
    revokeObjectUrl(objectUrl)
    setObjectUrl(null)
    onChange(null)
    onFileSelect?.(null)
    setSizeError(null)
    setPreviewOpen(false)
  }

  const previewSource = value
    ? resolvePreviewSource(value.fileData, localFileSentinel, objectUrl)
    : null

  return (
    <div className="space-y-3 lg:w-[40%] mt-2">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={handleInputChange}
      />

      {value?.fileData ? (
        <div className="space-y-3">
          <FilePreviewCard
            fileName={value.fileName}
            fileMimeType={value.fileMimeType}
            hint={previewSource ? "Click to preview" : uploadedHint}
            onClick={previewSource ? () => setPreviewOpen(true) : undefined}
          />

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-1.5"
              disabled={disabled}
              onClick={openFilePicker}
            >
              <Replace className="size-4" aria-hidden />
              Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="size-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="Remove file"
              disabled={disabled}
              onClick={clearFile}
            >
              <X className="size-4" aria-hidden />
            </Button>
          </div>

          <FilePreviewDialog
            open={previewOpen}
            onOpenChange={setPreviewOpen}
            fileName={value.fileName}
            fileMimeType={value.fileMimeType}
            fileSource={previewSource}
          />
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={openFilePicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "group relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200",
            "border-border/70 bg-gradient-to-b from-muted/30 to-background shadow-sm",
            "hover:border-primary/45 hover:bg-primary/[0.03] hover:shadow-md",
            "focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:outline-none",
            isDragging &&
              "scale-[1.01] border-primary bg-primary/5 shadow-md ring-2 ring-primary/20",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          <span
            className={cn(
              "flex size-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary transition-transform duration-200",
              "group-hover:scale-105 group-hover:bg-primary/15",
              isDragging && "scale-110 bg-primary/15"
            )}
          >
            {isDragging ? (
              <FileUp className="size-6" aria-hidden />
            ) : (
              <Upload className="size-6" aria-hidden />
            )}
          </span>

          <div className="space-y-1.5">
            <Typography variant="small" className="font-semibold">
              {isDragging ? "Drop file to upload" : title}
            </Typography>
            <Typography variant="muted" className="mx-auto max-w-sm text-sm">
              {description}
            </Typography>
          </div>

          <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
            {hint} · Max {formatFileSize(maxSizeBytes)}
          </span>
        </button>
      )}

      {sizeError ? (
        <Typography variant="muted" className="text-sm text-destructive">
          {sizeError}
        </Typography>
      ) : null}
    </div>
  )
}
