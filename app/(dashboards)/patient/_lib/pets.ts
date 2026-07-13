import { format, isValid, parse } from "date-fns"
import { z } from "zod"

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
  name: z.string().min(1, "Pet name is required."),
  species: z.string().min(1, "Species is required."),
  breed: z.string().optional(),
  sex: z.string().optional(),
  color: z.string().optional(),
  dateOfBirth: z.date().optional().nullable(),
  microchipId: z.string().optional(),
  veterinaryClinic: z.string().optional(),
  veterinaryPhone: z.string().optional(),
  veterinaryRecords: z.string().optional(),
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
  name: "",
  species: "",
  breed: "",
  sex: "",
  color: "",
  dateOfBirth: null,
  microchipId: "",
  veterinaryClinic: "",
  veterinaryPhone: "",
  veterinaryRecords: "",
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

export function petToFormValues(pet: {
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
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? "",
    sex: pet.sex ?? "",
    color: pet.color ?? "",
    dateOfBirth: parsePetDate(pet.dateOfBirth),
    microchipId: pet.microchipId ?? "",
    veterinaryClinic: pet.veterinaryClinic ?? "",
    veterinaryPhone: pet.veterinaryPhone ?? "",
    veterinaryRecords: pet.veterinaryRecords ?? "",
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
