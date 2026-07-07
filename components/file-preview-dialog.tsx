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
      <DialogContent className="flex max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden p-0 sm:max-h-[min(100dvh-2rem,900px)] sm:w-full sm:max-w-6xl">
        <DialogHeader className="shrink-0 border-b border-border/60 px-4 py-4 text-left sm:px-6 sm:py-5">
          <DialogTitle className="truncate pr-8 text-base sm:text-lg">
            {fileName}
          </DialogTitle>
          <DialogDescription className="truncate">
            {getFileExtension(fileName)} file preview
          </DialogDescription>
        </DialogHeader>

        <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/10 p-3 sm:p-4">
          {!fileSource ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/80 bg-background px-4 py-12 text-center sm:py-16">
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
                className="max-h-[45dvh] w-full object-contain sm:max-h-[65vh]"
              />
            </div>
          ) : isPdf ? (
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-background">
              <iframe
                src={pdfPreviewUrl ?? fileSource}
                title={fileName}
                className="h-[45dvh] w-full sm:h-[65vh]"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-background px-4 py-12 text-center sm:py-16">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="size-5" aria-hidden />
              </span>
              <Typography
                variant="small"
                className="max-w-full break-words font-medium"
              >
                {fileName}
              </Typography>
              <Typography variant="muted" className="text-sm">
                Preview is not supported for this file type.
              </Typography>
            </div>
          )}
        </div>

        {fileSource ? (
          <DialogFooter className="shrink-0 flex-col gap-2 border-t border-border/60 bg-muted/20 px-4 py-3 sm:flex-row sm:justify-between sm:px-6 sm:py-4">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-1.5 sm:w-auto"
              asChild
            >
              <a
                href={isPdf ? getPdfOpenUrl(fileSource) : fileSource}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="size-4" aria-hidden />
                Open in new tab
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-1.5 sm:w-auto"
              asChild
            >
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
