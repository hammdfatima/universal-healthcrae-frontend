"use client"

import { Download, FileText } from "lucide-react"

import {
  isImageMimeType,
  isPdfMimeType,
  type LabResult,
} from "@/app/(dashboards)/patient/_lib/lab"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

type LabResultFilePreviewProps = {
  result: LabResult
}

export default function LabResultFilePreview({
  result,
}: LabResultFilePreviewProps) {
  if (!result.fileData) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/80 bg-muted/10 px-4 py-10 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileText className="size-5" aria-hidden />
        </span>
        <Typography variant="muted" className="text-sm">
          No file attached to this lab result.
        </Typography>
      </div>
    )
  }

  if (isImageMimeType(result.fileMimeType)) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/10">
        {/* biome-ignore lint/performance/noImgElement: data URL preview from local upload */}
        <img
          src={result.fileData}
          alt={result.fileName}
          className="max-h-96 w-full object-contain"
        />
      </div>
    )
  }

  if (isPdfMimeType(result.fileMimeType)) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/10">
        <iframe
          src={result.fileData}
          title={result.fileName}
          className="h-96 w-full"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-muted/10 px-4 py-8 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FileText className="size-5" aria-hidden />
      </span>
      <Typography variant="small" className="font-medium">
        {result.fileName}
      </Typography>
      <Button type="button" variant="outline" className="gap-1.5" asChild>
        <a href={result.fileData} download={result.fileName}>
          <Download className="size-4" aria-hidden />
          Download file
        </a>
      </Button>
    </div>
  )
}
