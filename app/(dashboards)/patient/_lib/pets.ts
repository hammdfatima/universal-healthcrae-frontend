import { differenceInYears, format, isValid, parse } from "date-fns"
import { z } from "zod"
import type { PatientProfileResponse } from "@/lib/api/patient-profile"
import type { CreatePetPayload } from "@/lib/api/pets"
import type { AuthUser } from "@/lib/auth/types"
import { getUserDisplayName } from "@/lib/auth/utils"

export const speciesOptions = [
  { label: "Dog", value: "Dog" },
  { label: "Cat", value: "Cat" },
  { label: "Bird", value: "Bird" },
  { label: "Rabbit", value: "Rabbit" },
  { label: "Other", value: "Other" },
] as const

export const sexOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Unknown", value: "Unknown" },
] as const

export const petSchema = z.object({
  profileImage: z.string(),
  name: z.string().min(1, "Pet name is required."),
  species: z.string().min(1, "Species is required."),
  breed: z.string().optional(),
  sex: z.string().optional(),
  color: z.string().optional(),
  dateOfBirth: z.date().optional().nullable(),
  weight: z.string().optional(),
  microchipId: z.string().optional(),
  ownerName: z.string().min(1, "Owner name is required."),
  ownerPhone: z.string().min(1, "Owner phone is required."),
  ownerEmail: z.string().email("Enter a valid owner email."),
  veterinaryClinic: z.string().optional(),
  veterinaryPhone: z.string().optional(),
  emergencyVeterinaryClinic: z.string().optional(),
  emergencyVeterinaryPhone: z.string().optional(),
  veterinaryRecords: z.string().optional(),
  additionalNotes: z.string().optional(),
  medicalConditions: z.array(
    z.object({
      name: z.string().min(1, "Condition name is required."),
      notes: z.string().optional(),
    })
  ),
  medications: z.array(
    z.object({
      name: z.string().min(1, "Medication name is required."),
      dosage: z.string().optional(),
      notes: z.string().optional(),
    })
  ),
  allergies: z.array(
    z.object({
      name: z.string().min(1, "Allergy name is required."),
      reaction: z.string().optional(),
      notes: z.string().optional(),
    })
  ),
  vaccinations: z.array(
    z.object({
      name: z.string().min(1, "Vaccination name is required."),
      dateGiven: z.date().optional().nullable(),
      nextDue: z.date().optional().nullable(),
      notes: z.string().optional(),
    })
  ),
  emergencyContactFamilyMemberId: z.string().nullable(),
})

export type PetFormValues = z.infer<typeof petSchema>

export const petDefaultValues: PetFormValues = {
  profileImage: "",
  name: "",
  species: "",
  breed: "",
  sex: "",
  color: "",
  dateOfBirth: null,
  weight: "",
  microchipId: "",
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
  veterinaryClinic: "",
  veterinaryPhone: "",
  emergencyVeterinaryClinic: "",
  emergencyVeterinaryPhone: "",
  veterinaryRecords: "",
  additionalNotes: "",
  medicalConditions: [],
  medications: [],
  allergies: [],
  vaccinations: [],
  emergencyContactFamilyMemberId: null,
}

export function formatPetDate(date: Date): string {
  return format(date, "MM/dd/yyyy")
}

export function parsePetDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const parsed = parse(value, "MM/dd/yyyy", new Date())
  return isValid(parsed) ? parsed : null
}

export function getPetAgeLabel(
  dateOfBirth: string | Date | null | undefined
): string | null {
  const parsed =
    dateOfBirth instanceof Date
      ? dateOfBirth
      : typeof dateOfBirth === "string"
        ? parsePetDate(dateOfBirth)
        : null

  if (!parsed) return null

  const years = differenceInYears(new Date(), parsed)
  if (years < 1) return "Less than 1 year old"
  return `${years} year${years === 1 ? "" : "s"} old`
}

export function getPetOwnerDefaults(
  user: AuthUser,
  profile?: PatientProfileResponse | null
): Pick<PetFormValues, "ownerName" | "ownerPhone" | "ownerEmail"> {
  const ownerName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
      getUserDisplayName(user)
    : getUserDisplayName(user)

  return {
    ownerName,
    ownerPhone: profile?.phone?.trim() ?? "",
    ownerEmail: profile?.email ?? user.email,
  }
}

export function petFormValuesToPayload(
  values: PetFormValues
): CreatePetPayload {
  return {
    profileImage: values.profileImage.trim() || undefined,
    name: values.name,
    species: values.species,
    breed: values.breed ?? "",
    sex: values.sex ?? "",
    color: values.color ?? "",
    dateOfBirth: values.dateOfBirth ? formatPetDate(values.dateOfBirth) : "",
    weight: values.weight ?? "",
    microchipId: values.microchipId ?? "",
    ownerName: values.ownerName,
    ownerPhone: values.ownerPhone,
    ownerEmail: values.ownerEmail,
    veterinaryClinic: values.veterinaryClinic ?? "",
    veterinaryPhone: values.veterinaryPhone ?? "",
    emergencyVeterinaryClinic: values.emergencyVeterinaryClinic ?? "",
    emergencyVeterinaryPhone: values.emergencyVeterinaryPhone ?? "",
    veterinaryRecords: values.veterinaryRecords ?? "",
    additionalNotes: values.additionalNotes ?? "",
    medicalConditions: values.medicalConditions,
    medications: values.medications,
    allergies: values.allergies,
    vaccinations: values.vaccinations.map((item) => ({
      name: item.name,
      notes: item.notes ?? "",
      dateGiven: item.dateGiven ? formatPetDate(item.dateGiven) : "",
      nextDue: item.nextDue ? formatPetDate(item.nextDue) : "",
    })),
    emergencyContactFamilyMemberId: values.emergencyContactFamilyMemberId,
  }
}

export function petToFormValues(pet: {
  profileImage?: string | null
  name: string
  species: string
  breed: string | null
  sex: string | null
  color: string | null
  dateOfBirth: string | null
  weight?: string | null
  microchipId: string | null
  ownerName?: string | null
  ownerPhone?: string | null
  ownerEmail?: string | null
  veterinaryClinic: string | null
  veterinaryPhone: string | null
  emergencyVeterinaryClinic?: string | null
  emergencyVeterinaryPhone?: string | null
  veterinaryRecords: string | null
  additionalNotes?: string | null
  medicalConditions?: { name: string; notes?: string }[]
  medications: { name: string; dosage?: string; notes?: string }[]
  allergies: { name: string; reaction?: string; notes?: string }[]
  vaccinations: {
    name: string
    dateGiven?: string
    nextDue?: string
    notes?: string
  }[]
  emergencyContactFamilyMemberId: string | null
}): PetFormValues {
  return {
    profileImage: pet.profileImage ?? "",
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? "",
    sex: pet.sex ?? "",
    color: pet.color ?? "",
    dateOfBirth: parsePetDate(pet.dateOfBirth),
    weight: pet.weight ?? "",
    microchipId: pet.microchipId ?? "",
    ownerName: pet.ownerName ?? "",
    ownerPhone: pet.ownerPhone ?? "",
    ownerEmail: pet.ownerEmail ?? "",
    veterinaryClinic: pet.veterinaryClinic ?? "",
    veterinaryPhone: pet.veterinaryPhone ?? "",
    emergencyVeterinaryClinic: pet.emergencyVeterinaryClinic ?? "",
    emergencyVeterinaryPhone: pet.emergencyVeterinaryPhone ?? "",
    veterinaryRecords: pet.veterinaryRecords ?? "",
    additionalNotes: pet.additionalNotes ?? "",
    medicalConditions: (pet.medicalConditions ?? []).map((item) => ({
      name: item.name,
      notes: item.notes ?? "",
    })),
    medications: pet.medications.map((item) => ({
      name: item.name,
      dosage: item.dosage ?? "",
      notes: item.notes ?? "",
    })),
    allergies: pet.allergies.map((item) => ({
      name: item.name,
      reaction: item.reaction ?? "",
      notes: item.notes ?? "",
    })),
    vaccinations: pet.vaccinations.map((item) => ({
      name: item.name,
      dateGiven: parsePetDate(item.dateGiven),
      nextDue: parsePetDate(item.nextDue),
      notes: item.notes ?? "",
    })),
    emergencyContactFamilyMemberId: pet.emergencyContactFamilyMemberId,
  }
}
