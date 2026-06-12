"use client"

import {
  formValuesToLabResult,
  getLabResultsFromStorage,
  type LabResultFormValues,
  saveLabResultsToStorage,
} from "@/app/(dashboards)/patient/_lib/lab"
import LabResultForm from "@/app/(dashboards)/patient/lab/_components/lab-result-form"

export default function NewLabResultPage() {
  function handleSubmit(values: LabResultFormValues) {
    const results = getLabResultsFromStorage()
    const newResult = formValuesToLabResult(values, crypto.randomUUID())
    saveLabResultsToStorage([...results, newResult])
  }

  return (
    <LabResultForm
      title="Add Lab Result"
      description="Upload a lab report with file name, test type, and test date."
      submitLabel="Save"
      onSubmit={handleSubmit}
    />
  )
}
