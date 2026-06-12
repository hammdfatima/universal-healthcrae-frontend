"use client"

import {
  type CareProviderFormValues,
  formValuesToCareProvider,
  getCareProvidersFromStorage,
  saveCareProvidersToStorage,
} from "@/app/(dashboards)/patient/_lib/providers"
import CareProviderForm from "@/app/(dashboards)/patient/provider/_components/care-provider-form"

export default function NewCareProviderPage() {
  function handleSubmit(values: CareProviderFormValues) {
    const providers = getCareProvidersFromStorage()
    const newProvider = formValuesToCareProvider(values, crypto.randomUUID())
    saveCareProvidersToStorage([...providers, newProvider])
  }

  return (
    <CareProviderForm
      title="Add Care Provider"
      description="Add a doctor or healthcare provider with contact and clinic details."
      submitLabel="Save"
      onSubmit={handleSubmit}
    />
  )
}
