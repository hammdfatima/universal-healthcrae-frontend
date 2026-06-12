"use client"

import {
  formValuesToHealthHistoryEntry,
  getHealthHistoryFromStorage,
  type HealthHistoryFormValues,
  saveHealthHistoryToStorage,
} from "@/app/(dashboards)/patient/_lib/health-history"
import HealthHistoryForm from "@/app/(dashboards)/patient/health-history/_components/health-history-form"

export default function NewHealthHistoryPage() {
  function handleSubmit(values: HealthHistoryFormValues) {
    const entries = getHealthHistoryFromStorage()
    const newEntry = formValuesToHealthHistoryEntry(values, crypto.randomUUID())
    saveHealthHistoryToStorage([...entries, newEntry])
  }

  return (
    <HealthHistoryForm
      title="Add Diagnosis"
      description="Record an illness or condition with diagnosis date, provider, and treatment details."
      submitLabel="Save"
      onSubmit={handleSubmit}
    />
  )
}
