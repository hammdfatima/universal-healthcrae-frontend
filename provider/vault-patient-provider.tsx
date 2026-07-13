"use client"

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import {
  type AccessiblePatient,
  type AccessiblePatientsResponse,
  MEDICAL_RECORD_SHARES_API,
  MEDICAL_RECORD_SHARES_QUERY_KEYS,
} from "@/lib/api/medical-record-shares"

type VaultPatientContextValue = {
  selfUserId: string | null
  activePatientUserId: string | null
  setActivePatientUserId: (userId: string) => void
  isViewingOwnVault: boolean
  accessiblePatients: AccessiblePatient[]
  activePatient: AccessiblePatient | null
  isLoading: boolean
  withPatientQuery: (path: string) => string
  vaultQueryKey: (baseKey: readonly unknown[]) => readonly unknown[]
}

const VaultPatientContext = createContext<VaultPatientContextValue | null>(null)

export function VaultPatientProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const selfUserId = user?.id ?? null
  const [activePatientUserId, setActivePatientUserIdState] = useState<
    string | null
  >(null)

  const { data, isLoading } = useFetch<AccessiblePatientsResponse>({
    path: MEDICAL_RECORD_SHARES_API.accessiblePatients,
    queryKey: MEDICAL_RECORD_SHARES_QUERY_KEYS.accessiblePatients,
    enabled: Boolean(selfUserId),
  })

  const accessiblePatients = data?.patients ?? []

  useEffect(() => {
    if (!selfUserId) {
      setActivePatientUserIdState(null)
      return
    }

    setActivePatientUserIdState((current) => {
      if (current && accessiblePatients.some((p) => p.userId === current)) {
        return current
      }
      return selfUserId
    })
  }, [accessiblePatients, selfUserId])

  const setActivePatientUserId = useCallback(
    (userId: string) => {
      if (accessiblePatients.some((patient) => patient.userId === userId)) {
        setActivePatientUserIdState(userId)
      }
    },
    [accessiblePatients]
  )

  const activePatient =
    accessiblePatients.find(
      (patient) => patient.userId === activePatientUserId
    ) ?? null

  const isViewingOwnVault =
    !activePatientUserId || activePatientUserId === selfUserId

  const withPatientQuery = useCallback(
    (path: string) => {
      if (!activePatientUserId || activePatientUserId === selfUserId) {
        return path
      }
      const separator = path.includes("?") ? "&" : "?"
      return `${path}${separator}patientUserId=${encodeURIComponent(activePatientUserId)}`
    },
    [activePatientUserId, selfUserId]
  )

  const vaultQueryKey = useCallback(
    (baseKey: readonly unknown[]) => [
      ...baseKey,
      activePatientUserId ?? selfUserId ?? "self",
    ],
    [activePatientUserId, selfUserId]
  )

  const value = useMemo(
    () => ({
      selfUserId,
      activePatientUserId,
      setActivePatientUserId,
      isViewingOwnVault,
      accessiblePatients,
      activePatient,
      isLoading,
      withPatientQuery,
      vaultQueryKey,
    }),
    [
      selfUserId,
      activePatientUserId,
      setActivePatientUserId,
      isViewingOwnVault,
      accessiblePatients,
      activePatient,
      isLoading,
      withPatientQuery,
      vaultQueryKey,
    ]
  )

  return (
    <VaultPatientContext.Provider value={value}>
      {children}
    </VaultPatientContext.Provider>
  )
}

export function useVaultPatient() {
  const context = useContext(VaultPatientContext)
  if (!context) {
    throw new Error("useVaultPatient must be used within VaultPatientProvider")
  }
  return context
}
