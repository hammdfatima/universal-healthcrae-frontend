"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import {
  formValuesToLabResult,
  getLabResultById,
  getLabResultsFromStorage,
  type LabResult,
  type LabResultFormValues,
  labResultToFormValues,
  saveLabResultsToStorage,
} from "@/app/(dashboards)/patient/_lib/lab"
import LabResultForm from "@/app/(dashboards)/patient/lab/_components/lab-result-form"
import { Typography } from "@/components/ui/typography"

export default function EditLabResultPage() {
  const params = useParams<{ id: string }>()
  const [result, setResult] = useState<LabResult | null>(null)

  useEffect(() => {
    setResult(getLabResultById(params.id) ?? null)
  }, [params.id])

  function handleSubmit(values: LabResultFormValues) {
    if (!result) return

    const results = getLabResultsFromStorage()
    const updated = formValuesToLabResult(values, result.id)
    saveLabResultsToStorage(
      results.map((item) => (item.id === result.id ? updated : item))
    )
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Lab result not found</Typography>
        <Typography variant="muted" className="mt-2">
          This record may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <LabResultForm
      key={result.id}
      title="Edit Lab Result"
      description={`Update details for ${result.fileName}.`}
      defaultValues={labResultToFormValues(result)}
      submitLabel="Save Changes"
      onSubmit={handleSubmit}
    />
  )
}
