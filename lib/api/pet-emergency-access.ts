import type { Pet } from "@/lib/api/pets"

export type PetEmergencyAccessToken = {
  token: string
  accessUrl: string
  isActive: boolean
  expiresAt: string
  createdAt: string
  updatedAt: string
  lastAccessedAt: string | null
}

export type PetEmergencyAccessStatus = {
  hasToken: boolean
  access: PetEmergencyAccessToken | null
}

export type PublicPetEmergencyChallenge = {
  needsPin: true
  petInitials: string
  petNameHint: string
  expiresAt: string
}

export type PublicPetEmergencyRecords = Pet & {
  accessedAt: string
}

export const PET_EMERGENCY_ACCESS_API = {
  status: (petId: string) => `/pets/${petId}/emergency-access`,
  generate: (petId: string) => `/pets/${petId}/emergency-access/generate`,
  revoke: (petId: string) => `/pets/${petId}/emergency-access`,
  publicChallenge: (token: string) => `/pets/emergency-access/public/${token}`,
  unlock: (token: string) => `/pets/emergency-access/public/${token}/unlock`,
} as const

export const PET_EMERGENCY_ACCESS_QUERY_KEYS = {
  status: (petId: string) =>
    ["pets", petId, "emergency-access", "status"] as const,
  publicChallenge: (token: string) =>
    ["pets", "emergency-access", "challenge", token] as const,
}
