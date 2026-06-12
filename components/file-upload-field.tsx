"use client"

import { FileImage, FileText, FileUp, Replace, Upload, X } from "lucide-react"
import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

export type UploadedFileValue = {
  fileData: string
  fileName: string
  fileMimeType: string
}

type FileUploadFieldProps = {
  value?: UploadedFileValue | null
  onChange: (file: UploadedFileValue | null) => void
  accept?: string
  disabled?: boolean
  id?: string
  title?: string
  description?: string
  hint?: string
  uploadedHint?: string
}

function getFileExtension(fileName: string): string {
  const parts = fileName.split(".")
  if (parts.length < 2) return "FILE"
  return parts.at(-1)?.toUpperCase() ?? "FILE"
}

function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith("image/")
}

function readFile(file: File, onChange: (value: UploadedFileValue) => void) {
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
  accept = ".pdf,.png,.jpg,.jpeg,.webp",
  disabled,
  id,
  title = "Upload file",
  description = "Drag and drop your file here, or browse from your device",
  hint = "Supports PDF, PNG, JPG, and WEBP",
  uploadedHint = "Ready to save with this record",
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleSelectedFile(file: File | undefined) {
    if (!file || disabled) return
    readFile(file, onChange)
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
        <div className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background shadow-sm">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            {isImageFile(value.fileMimeType) ? (
              <div className="relative mx-auto size-24 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted sm:mx-0">
                {/* biome-ignore lint/performance/noImgElement: local data URL preview */}
                <img
                  src={value.fileData}
                  alt={value.fileName}
                  className="size-full object-cover"
                />
              </div>
            ) : (
              <span className="mx-auto flex size-16 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary sm:mx-0">
                {value.fileMimeType === "application/pdf" ? (
                  <FileText className="size-7" aria-hidden />
                ) : (
                  <FileImage className="size-7" aria-hidden />
                )}
              </span>
            )}

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Typography variant="small" className="truncate font-semibold">
                  {value.fileName}
                </Typography>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase">
                  {getFileExtension(value.fileName)}
                </span>
              </div>
              <Typography variant="muted" className="mt-1 text-xs">
                {uploadedHint}
              </Typography>
            </div>

            <div className="flex items-center justify-center gap-2 sm:shrink-0">
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
                onClick={() => onChange(null)}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
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
            {hint}
          </span>
        </button>
      )}
    </div>
  )
}
