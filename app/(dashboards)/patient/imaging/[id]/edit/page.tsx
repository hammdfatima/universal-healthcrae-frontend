"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import {
  formValuesToImagingResult,
  getImagingResultById,
  getImagingResultsFromStorage,
  type ImagingResult,
  type ImagingResultFormValues,
  imagingResultToFormValues,
  saveImagingResultsToStorage,
} from "@/app/(dashboards)/patient/_lib/imaging"
import ImagingResultForm from "@/app/(dashboards)/patient/imaging/_components/imaging-result-form"
import { Typography } from "@/components/ui/typography"

export default function EditImagingPage() {
  const params = useParams<{ id: string }>()
  const [result, setResult] = useState<ImagingResult | null>(null)

  useEffect(() => {
    setResult(getImagingResultById(params.id) ?? null)
  }, [params.id])

  function handleSubmit(values: ImagingResultFormValues) {
    if (!result) return

    const results = getImagingResultsFromStorage()
    const updated = formValuesToImagingResult(values, result.id)
    saveImagingResultsToStorage(
      results.map((item) => (item.id === result.id ? updated : item))
    )
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Imaging record not found</Typography>
        <Typography variant="muted" className="mt-2">
          This record may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <ImagingResultForm
      key={result.id}
      title="Edit Imaging"
      description={`Update details for ${result.fileName}.`}
      defaultValues={imagingResultToFormValues(result)}
      submitLabel="Save Changes"
      onSubmit={handleSubmit}
    />
  )
}
