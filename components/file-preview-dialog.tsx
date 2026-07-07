"use client"

import { Download, ExternalLink, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"
import {
  getFileExtension,
  getPdfDownloadUrl,
  getPdfOpenUrl,
  getPdfPreviewUrl,
  isImageMimeType,
  isPdfMimeType,
} from "@/lib/file-preview"

type FilePreviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileName: string
  fileMimeType: string
  fileSource: string | null
}

export default function FilePreviewDialog({
  open,
  onOpenChange,
  fileName,
  fileMimeType,
  fileSource,
}: FilePreviewDialogProps) {
  const isPdf = isPdfMimeType(fileMimeType, fileName)
  const pdfPreviewUrl =
    fileSource && isPdf ? getPdfPreviewUrl(fileSource) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-6xl">
        <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
          <DialogTitle className="truncate pr-8">{fileName}</DialogTitle>
          <DialogDescription>
            {getFileExtension(fileName)} file preview
          </DialogDescription>
        </DialogHeader>

        <div className="thin-scrollbar max-h-[70vh] overflow-y-auto bg-muted/10 p-4">
          {!fileSource ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/80 bg-background px-4 py-16 text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <FileText className="size-5" aria-hidden />
              </span>
              <Typography variant="muted" className="text-sm">
                Preview is not available for this file.
              </Typography>
            </div>
          ) : isImageMimeType(fileMimeType) ? (
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-background">
              {/* biome-ignore lint/performance/noImgElement: file preview dialog */}
              <img
                src={fileSource}
                alt={fileName}
                className="max-h-[65vh] w-full object-contain"
              />
            </div>
          ) : isPdf ? (
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-background">
              <iframe
                src={pdfPreviewUrl ?? fileSource}
                title={fileName}
                className="h-[65vh] w-full"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-background px-4 py-16 text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="size-5" aria-hidden />
              </span>
              <Typography variant="small" className="font-medium">
                {fileName}
              </Typography>
              <Typography variant="muted" className="text-sm">
                Preview is not supported for this file type.
              </Typography>
            </div>
          )}
        </div>

        {fileSource ? (
          <DialogFooter className="border-t border-border/60 bg-muted/20 px-6 py-4 sm:justify-between">
            <Button type="button" variant="outline" className="gap-1.5" asChild>
              <a
                href={isPdf ? getPdfOpenUrl(fileSource) : fileSource}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="size-4" aria-hidden />
                Open in new tab
              </a>
            </Button>
            <Button type="button" variant="outline" className="gap-1.5" asChild>
              <a
                href={isPdf ? getPdfDownloadUrl(fileSource) : fileSource}
                download={fileName}
                target="_blank"
                rel="noreferrer"
              >
                <Download className="size-4" aria-hidden />
                Download
              </a>
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
