"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import {
  formValuesToHealthHistoryEntry,
  getHealthHistoryEntryById,
  getHealthHistoryFromStorage,
  type HealthHistoryEntry,
  type HealthHistoryFormValues,
  healthHistoryToFormValues,
  saveHealthHistoryToStorage,
} from "@/app/(dashboards)/patient/_lib/health-history"
import HealthHistoryForm from "@/app/(dashboards)/patient/health-history/_components/health-history-form"
import { Typography } from "@/components/ui/typography"

export default function EditHealthHistoryPage() {
  const params = useParams<{ id: string }>()
  const [entry, setEntry] = useState<HealthHistoryEntry | null>(null)

  useEffect(() => {
    setEntry(getHealthHistoryEntryById(params.id) ?? null)
  }, [params.id])

  function handleSubmit(values: HealthHistoryFormValues) {
    if (!entry) return

    const entries = getHealthHistoryFromStorage()
    const updated = formValuesToHealthHistoryEntry(values, entry.id)
    saveHealthHistoryToStorage(
      entries.map((item) => (item.id === entry.id ? updated : item))
    )
  }

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Diagnosis not found</Typography>
        <Typography variant="muted" className="mt-2">
          This entry may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <HealthHistoryForm
      key={entry.id}
      title="Edit Diagnosis"
      description={`Update details for ${entry.illnessName}.`}
      defaultValues={healthHistoryToFormValues(entry)}
      submitLabel="Save Changes"
      onSubmit={handleSubmit}
    />
  )
}
