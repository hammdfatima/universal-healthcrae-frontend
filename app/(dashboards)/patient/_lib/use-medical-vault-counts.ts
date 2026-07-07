"use client"

import { useFetch } from "@/hooks/use-fetch"
import {
  ALLERGIES_API,
  ALLERGIES_QUERY_KEYS,
  type AllergiesListResponse,
} from "@/lib/api/allergies"
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

export type MedicalVaultCounts = {
  medications: number
  allergies: number
  healthHistory: number
  vaccinations: number
  labResults: number
  imagingResults: number
}

export function useMedicalVaultCounts() {
  const medicationsQuery = useFetch<MedicationsListResponse>({
    path: MEDICATIONS_API.list,
    queryKey: MEDICATIONS_QUERY_KEYS.list,
  })
  const allergiesQuery = useFetch<AllergiesListResponse>({
    path: ALLERGIES_API.list,
    queryKey: ALLERGIES_QUERY_KEYS.list,
  })
  const healthHistoryQuery = useFetch<HealthHistoryListResponse>({
    path: HEALTH_HISTORY_API.list,
    queryKey: HEALTH_HISTORY_QUERY_KEYS.list,
  })
  const vaccinationsQuery = useFetch<VaccinationsListResponse>({
    path: VACCINATIONS_API.list,
    queryKey: VACCINATIONS_QUERY_KEYS.list,
  })
  const labResultsQuery = useFetch<LabResultsListResponse>({
    path: LAB_RESULTS_API.list,
    queryKey: LAB_RESULTS_QUERY_KEYS.list,
  })
  const imagingResultsQuery = useFetch<ImagingResultsListResponse>({
    path: IMAGING_RESULTS_API.list,
    queryKey: IMAGING_RESULTS_QUERY_KEYS.list,
  })

  const counts: MedicalVaultCounts = {
    medications: medicationsQuery.data?.medications.length ?? 0,
    allergies: allergiesQuery.data?.allergies.length ?? 0,
    healthHistory: healthHistoryQuery.data?.entries.length ?? 0,
    vaccinations: vaccinationsQuery.data?.vaccinations.length ?? 0,
    labResults: labResultsQuery.data?.labResults.length ?? 0,
    imagingResults: imagingResultsQuery.data?.imagingResults.length ?? 0,
  }

  const isLoading =
    medicationsQuery.isLoading ||
    allergiesQuery.isLoading ||
    healthHistoryQuery.isLoading ||
    vaccinationsQuery.isLoading ||
    labResultsQuery.isLoading ||
    imagingResultsQuery.isLoading

  return { counts, isLoading }
}
