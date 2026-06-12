"use client"

import {
  formValuesToImagingResult,
  getImagingResultsFromStorage,
  type ImagingResultFormValues,
  saveImagingResultsToStorage,
} from "@/app/(dashboards)/patient/_lib/imaging"
import ImagingResultForm from "@/app/(dashboards)/patient/imaging/_components/imaging-result-form"

export default function NewImagingPage() {
  function handleSubmit(values: ImagingResultFormValues) {
    const results = getImagingResultsFromStorage()
    const newResult = formValuesToImagingResult(values, crypto.randomUUID())
    saveImagingResultsToStorage([...results, newResult])
  }

  return (
    <ImagingResultForm
      title="Add Imaging"
      description="Upload a scan with file name, test type, scan type, and scan date."
      submitLabel="Save"
      onSubmit={handleSubmit}
    />
  )
}
