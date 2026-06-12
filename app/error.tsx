"use client"

import { useEffect } from "react"

import ErrorPageShell from "@/app/_components/error-page-shell"

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorPageShell
      code="500"
      title="Something went wrong"
      description="An unexpected error occurred while loading this page. Please try again or return to the homepage."
      onRetry={reset}
    />
  )
}
