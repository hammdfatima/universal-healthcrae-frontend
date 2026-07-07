"use client"

import type { Route } from "next"
import { useMemo } from "react"
import { useFetch } from "@/hooks/use-fetch"
import {
  ALLERGIES_API,
  ALLERGIES_QUERY_KEYS,
  type AllergiesListResponse,
} from "@/lib/api/allergies"
import {
  CARE_PROVIDERS_API,
  CARE_PROVIDERS_QUERY_KEYS,
  type CareProvidersListResponse,
} from "@/lib/api/care-providers"
import {
  FAMILY_MEMBERS_API,
  FAMILY_MEMBERS_QUERY_KEYS,
  type FamilyMembersListResponse,
} from "@/lib/api/family-members"
import {
  HEALTH_HISTORY_API,
  HEALTH_HISTORY_QUERY_KEYS,
  type HealthHistoryListResponse,
} from "@/lib/api/health-history"
import {
  IMAGING_RESULTS_API,
  IMAGING_RESULTS_QUERY_KEYS,
  type ImagingResultsListResponse,
} from "@/lib/api/imaging-results"
import {
  LAB_RESULTS_API,
  LAB_RESULTS_QUERY_KEYS,
  type LabResultsListResponse,
} from "@/lib/api/lab-results"
import {
  MEDICATIONS_API,
  MEDICATIONS_QUERY_KEYS,
  type MedicationsListResponse,
} from "@/lib/api/medications"
import {
  VACCINATIONS_API,
  VACCINATIONS_QUERY_KEYS,
  type VaccinationsListResponse,
} from "@/lib/api/vaccinations"
import { PATIENT_SEARCH_PAGES } from "@/lib/dashboard-search/patient-pages"

import type { PortalSearchResult } from "@/lib/dashboard-search/types"

function recordResult(
  id: string,
  title: string,
  href: PortalSearchResult["href"],
  group: string,
  subtitle?: string,
  keywords: string[] = []
): PortalSearchResult {
  return {
    id,
    title,
    subtitle,
    href,
    group,
    keywords: [title, subtitle, group, ...keywords]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  }
}

export function usePatientPortalSearch(enabled: boolean) {
  const medicationsQuery = useFetch<MedicationsListResponse>({
    path: MEDICATIONS_API.list,
    queryKey: MEDICATIONS_QUERY_KEYS.list,
    enabled,
  })
  const allergiesQuery = useFetch<AllergiesListResponse>({
    path: ALLERGIES_API.list,
    queryKey: ALLERGIES_QUERY_KEYS.list,
    enabled,
  })
  const healthHistoryQuery = useFetch<HealthHistoryListResponse>({
    path: HEALTH_HISTORY_API.list,
    queryKey: HEALTH_HISTORY_QUERY_KEYS.list,
    enabled,
  })
  const vaccinationsQuery = useFetch<VaccinationsListResponse>({
    path: VACCINATIONS_API.list,
    queryKey: VACCINATIONS_QUERY_KEYS.list,
    enabled,
  })
  const labResultsQuery = useFetch<LabResultsListResponse>({
    path: LAB_RESULTS_API.list,
    queryKey: LAB_RESULTS_QUERY_KEYS.list,
    enabled,
  })
  const imagingResultsQuery = useFetch<ImagingResultsListResponse>({
    path: IMAGING_RESULTS_API.list,
    queryKey: IMAGING_RESULTS_QUERY_KEYS.list,
    enabled,
  })
  const careProvidersQuery = useFetch<CareProvidersListResponse>({
    path: CARE_PROVIDERS_API.list,
    queryKey: CARE_PROVIDERS_QUERY_KEYS.list,
    enabled,
  })
  const familyMembersQuery = useFetch<FamilyMembersListResponse>({
    path: FAMILY_MEMBERS_API.list,
    queryKey: FAMILY_MEMBERS_QUERY_KEYS.list,
    enabled,
  })

  const recordResults = useMemo(() => {
    const results: PortalSearchResult[] = []

    for (const medication of medicationsQuery.data?.medications ?? []) {
      results.push(
        recordResult(
          `medication-${medication.id}`,
          medication.medicineName,
          `/patient/medications/${medication.id}/edit` as Route,
          "Medications",
          `${medication.condition} · ${medication.dosage}`,
          [medication.prescribedBy, medication.condition]
        )
      )
    }

    for (const allergy of allergiesQuery.data?.allergies ?? []) {
      results.push(
        recordResult(
          `allergy-${allergy.id}`,
          `${allergy.allergyType} allergy`,
          `/patient/allergies/${allergy.id}/edit` as Route,
          "Allergies",
          allergy.nature,
          [...allergy.symptoms, ...allergy.triggers]
        )
      )
    }

    for (const entry of healthHistoryQuery.data?.entries ?? []) {
      results.push(
        recordResult(
          `health-history-${entry.id}`,
          entry.illnessName,
          `/patient/health-history/${entry.id}/edit` as Route,
          "Health History",
          entry.details,
          [entry.prescribedBy]
        )
      )
    }

    for (const vaccination of vaccinationsQuery.data?.vaccinations ?? []) {
      results.push(
        recordResult(
          `vaccination-${vaccination.id}`,
          vaccination.vaccineName,
          `/patient/vaccinations/${vaccination.id}/edit` as Route,
          "Vaccinations",
          vaccination.administeredBy,
          [vaccination.dosage, vaccination.prescribedBy]
        )
      )
    }

    for (const labResult of labResultsQuery.data?.labResults ?? []) {
      results.push(
        recordResult(
          `lab-${labResult.id}`,
          labResult.fileName,
          `/patient/lab/${labResult.id}/edit` as Route,
          "Lab Results",
          labResult.testType,
          [labResult.testDate]
        )
      )
    }

    for (const imagingResult of imagingResultsQuery.data?.imagingResults ??
      []) {
      results.push(
        recordResult(
          `imaging-${imagingResult.id}`,
          imagingResult.fileName,
          `/patient/imaging/${imagingResult.id}/edit` as Route,
          "Imaging Results",
          `${imagingResult.testType} · ${imagingResult.scanType}`,
          [imagingResult.scanDate]
        )
      )
    }

    for (const provider of careProvidersQuery.data?.providers ?? []) {
      results.push(
        recordResult(
          `provider-${provider.id}`,
          provider.name,
          `/patient/provider/${provider.id}/edit` as Route,
          "Care Providers",
          provider.clinicDetails ?? provider.email ?? provider.phone,
          [provider.email ?? "", provider.phone, provider.clinicDetails ?? ""]
        )
      )
    }

    for (const member of familyMembersQuery.data?.members ?? []) {
      results.push(
        recordResult(
          `family-${member.id}`,
          `${member.firstName} ${member.lastName}`.trim(),
          `/patient/family-members/${member.id}/edit` as Route,
          "Family Members",
          member.relationship,
          [member.email, member.phone ?? "", member.relationship]
        )
      )
    }

    return results
  }, [
    allergiesQuery.data?.allergies,
    careProvidersQuery.data?.providers,
    familyMembersQuery.data?.members,
    healthHistoryQuery.data?.entries,
    imagingResultsQuery.data?.imagingResults,
    labResultsQuery.data?.labResults,
    medicationsQuery.data?.medications,
    vaccinationsQuery.data?.vaccinations,
  ])

  const isLoading =
    medicationsQuery.isLoading ||
    allergiesQuery.isLoading ||
    healthHistoryQuery.isLoading ||
    vaccinationsQuery.isLoading ||
    labResultsQuery.isLoading ||
    imagingResultsQuery.isLoading ||
    careProvidersQuery.isLoading ||
    familyMembersQuery.isLoading

  return {
    pages: PATIENT_SEARCH_PAGES,
    records: recordResults,
    isLoading,
  }
}
