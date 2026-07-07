"use client"

import { FileImage, FileText } from "lucide-react"

import { Typography } from "@/components/ui/typography"
import {
  getFileExtension,
  isImageMimeType,
  isPdfMimeType,
} from "@/lib/file-preview"
import { cn } from "@/lib/utils"

type FilePreviewCardProps = {
  fileName: string
  fileMimeType: string
  onClick?: () => void
  hint?: string
  className?: string
}

export default function FilePreviewCard({
  fileName,
  fileMimeType,
  onClick,
  hint = "Click to preview",
  className,
}: FilePreviewCardProps) {
  const isClickable = Boolean(onClick)
  const Icon = isPdfMimeType(fileMimeType, fileName)
    ? FileText
    : isImageMimeType(fileMimeType)
      ? FileImage
      : FileText

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border border-border/60 bg-muted/10 px-4 py-3 text-left transition-colors",
        isClickable &&
          "cursor-pointer hover:border-primary/30 hover:bg-primary/5 focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:outline-none",
        !isClickable && "cursor-default",
        className
      )}
    >
      <span className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
        <Icon className="size-6" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Typography variant="small" className="truncate font-semibold">
            {fileName}
          </Typography>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase">
            {getFileExtension(fileName)}
          </span>
        </div>
        {hint ? (
          <Typography variant="muted" className="mt-1 text-xs">
            {hint}
          </Typography>
        ) : null}
      </div>
    </button>
  )
}
