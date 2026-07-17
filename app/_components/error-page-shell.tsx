import { AlertTriangle, Home, RotateCcw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

type ErrorPageShellProps = {
  code: string
  title: string
  description: string
  onRetry?: () => void
}

export default function ErrorPageShell({
  code,
  title,
  description,
  onRetry,
}: ErrorPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <Link href="/" className="mb-8 inline-block">
          <Image
            src="/logo.png"
            alt="Universal Health Charts"
            width={240}
            height={60}
            className="mx-auto h-10 w-auto sm:h-11"
            quality={100}
            priority
          />
        </Link>

        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 shadow-sm sm:p-10">
          <div className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full bg-primary/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 size-32 rounded-full bg-secondary/10 blur-2xl" />

          <div className="relative">
            <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="size-7" aria-hidden />
            </span>

            <Typography
              as="p"
              variant="h2"
              className="text-5xl font-bold tracking-tight text-primary sm:text-6xl"
            >
              {code}
            </Typography>

            <Typography as="h1" variant="h3" className="mt-3">
              {title}
            </Typography>

            <Typography
              variant="muted"
              className="mx-auto mt-3 max-w-sm text-sm"
            >
              {description}
            </Typography>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="gap-1.5">
                <Link href="/">
                  <Home className="size-4" aria-hidden />
                  Back to Home
                </Link>
              </Button>

              {onRetry ? (
                <Button
                  type="button"
                  variant="outline"
                  className="gap-1.5"
                  onClick={onRetry}
                >
                  <RotateCcw className="size-4" aria-hidden />
                  Try Again
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
