export type HouseholdMemberSharing = {
  userId: string
  firstName: string
  lastName: string
  email: string
  relationship: string
  isAccountOwner: boolean
  isSharedWith: boolean
}

export type MedicalRecordSharingSettings = {
  shareWithAll: boolean
  isManagedMember: boolean
  members: HouseholdMemberSharing[]
}

export type SidebarFamilyMember = {
  userId: string
  firstName: string
  lastName: string
  email: string
  relationship: string
  isAccountOwner: boolean
  hasSharedRecordsWithMe: boolean
  sharedPetCount: number
}

export type SidebarFamilyResponse = {
  isManagedMember: boolean
  canManageFamily: boolean
  members: SidebarFamilyMember[]
}

export type AccessiblePatient = {
  userId: string
  firstName: string
  lastName: string
  email: string
  relationship: string
  isSelf: boolean
}

export type AccessiblePatientsResponse = {
  patients: AccessiblePatient[]
}

export type UpdateSharingPayload = {
  shareWithAll: boolean
  granteeUserIds: string[]
}

export const MEDICAL_RECORD_SHARES_API = {
  settings: "/medical-record-shares/settings",
  sidebarFamily: "/medical-record-shares/sidebar-family",
  accessiblePatients: "/medical-record-shares/accessible-patients",
} as const

export const MEDICAL_RECORD_SHARES_QUERY_KEYS = {
  settings: ["medical-record-shares", "settings"] as const,
  sidebarFamily: ["medical-record-shares", "sidebar-family"] as const,
  accessiblePatients: ["medical-record-shares", "accessible-patients"] as const,
}
