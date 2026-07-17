export type PetMedicationItem = {
  name: string
  dosage?: string
  notes?: string
}

export type PetAllergyItem = {
  name: string
  reaction?: string
  notes?: string
}

export type PetVaccinationItem = {
  name: string
  dateGiven?: string
  nextDue?: string
  notes?: string
}

export type PetEmergencyContact = {
  id: string
  firstName: string
  lastName: string
  relationship: string
  phone: string | null
  email: string
}

export type Pet = {
  id: string
  name: string
  species: string
  breed: string | null
  sex: string | null
  color: string | null
  dateOfBirth: string | null
  microchipId: string | null
  veterinaryClinic: string | null
  veterinaryPhone: string | null
  veterinaryRecords: string | null
  medications: PetMedicationItem[]
  allergies: PetAllergyItem[]
  vaccinations: PetVaccinationItem[]
  emergencyContactFamilyMemberId: string | null
  emergencyContact: PetEmergencyContact | null
  createdAt: string
  updatedAt: string
}

export type PetsListResponse = {
  pets: Pet[]
  limit: number
  usedSeats: number
  memberCount: number
  pausedPetCount: number
  supportsPets: boolean
}

export type PetSharingMember = {
  userId: string
  firstName: string
  lastName: string
  email: string
  relationship: string
  isAccountOwner: boolean
  isSharedWith: boolean
}

export type PetSharingSettings = {
  petId: string
  petName: string
  members: PetSharingMember[]
}

export type UpdatePetSharingPayload = {
  granteeUserIds: string[]
}

export type SharedPetsResponse = {
  pets: Pet[]
}

export type CreatePetPayload = {
  name: string
  species: string
  breed?: string
  sex?: string
  color?: string
  dateOfBirth?: string
  microchipId?: string
  veterinaryClinic?: string
  veterinaryPhone?: string
  veterinaryRecords?: string
  medications?: PetMedicationItem[]
  allergies?: PetAllergyItem[]
  vaccinations?: PetVaccinationItem[]
  emergencyContactFamilyMemberId?: string | null
}

export type UpdatePetPayload = CreatePetPayload

export const PETS_API = {
  list: "/pets",
  create: "/pets",
  shared: (ownerUserId: string) =>
    `/pets/shared?ownerUserId=${encodeURIComponent(ownerUserId)}`,
  sharingSettings: (id: string) => `/pets/${id}/sharing-settings`,
  update: (id: string) => `/pets/${id}`,
  delete: (id: string) => `/pets/${id}`,
} as const

export const PETS_QUERY_KEYS = {
  list: ["pets", "list"] as const,
  sharingSettings: (id: string) => ["pets", id, "sharing-settings"] as const,
  shared: (ownerUserId: string) => ["pets", "shared", ownerUserId] as const,
}
