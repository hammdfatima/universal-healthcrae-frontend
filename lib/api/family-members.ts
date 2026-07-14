export type FamilyMember = {
  id: string
  memberUserId: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  relationship: string
  dateOfBirth: string | null
  isEmergencyContact: boolean
  isAccessible: boolean
  createdAt: string
  updatedAt: string
}

export type FamilyMembersListResponse = {
  members: FamilyMember[]
  limit: number
  usedSeats: number
  petCount: number
  pausedPetCount: number
  canManage: boolean
  supportsPets: boolean
}

export type CreateFamilyMemberPayload = {
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: string
  dateOfBirth: string
  password: string
  isEmergencyContact: boolean
}

export type UpdateFamilyMemberPayload = {
  firstName: string
  lastName: string
  phone: string
  relationship: string
  dateOfBirth: string
  isEmergencyContact: boolean
}

export const FAMILY_MEMBERS_API = {
  list: "/family-members",
  create: "/family-members",
  update: (id: string) => `/family-members/${id}`,
  delete: (id: string) => `/family-members/${id}`,
} as const

export const FAMILY_MEMBERS_QUERY_KEYS = {
  list: ["family-members", "list"] as const,
}
