"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import {
  type CareProvider,
  type CareProviderFormValues,
  careProviderToFormValues,
  formValuesToCareProvider,
  getCareProviderById,
  getCareProvidersFromStorage,
  saveCareProvidersToStorage,
} from "@/app/(dashboards)/patient/_lib/providers"
import CareProviderForm from "@/app/(dashboards)/patient/provider/_components/care-provider-form"
import { Typography } from "@/components/ui/typography"

export default function EditCareProviderPage() {
  const params = useParams<{ id: string }>()
  const [provider, setProvider] = useState<CareProvider | null>(null)

  useEffect(() => {
    setProvider(getCareProviderById(params.id) ?? null)
  }, [params.id])

  function handleSubmit(values: CareProviderFormValues) {
    if (!provider) return

    const providers = getCareProvidersFromStorage()
    const updated = formValuesToCareProvider(values, provider.id)
    saveCareProvidersToStorage(
      providers.map((item) => (item.id === provider.id ? updated : item))
    )
  }

  if (!provider) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Care provider not found</Typography>
        <Typography variant="muted" className="mt-2">
          This provider may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <CareProviderForm
      key={provider.id}
      title="Edit Care Provider"
      description={`Update details for ${provider.name}.`}
      defaultValues={careProviderToFormValues(provider)}
      submitLabel="Save Changes"
      onSubmit={handleSubmit}
    />
  )
}
