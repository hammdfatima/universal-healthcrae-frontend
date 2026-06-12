import { format, isValid, parse } from "date-fns"
import { z } from "zod"

export const relationshipOptions = [
  { label: "Spouse", value: "Spouse" },
  { label: "Child", value: "Child" },
  { label: "Parent", value: "Parent" },
  { label: "Sibling", value: "Sibling" },
  { label: "Other", value: "Other" },
] as const

export type FamilyMember = {
  id: string
  firstName: string
  lastName: string
  relationship: string
  dateOfBirth: string
  phone: string
  email: string
  isEmergencyContact: boolean
}

export const familyMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  relationship: z.string().min(1, "Relationship is required."),
  dateOfBirth: z.date({ message: "Date of birth is required." }),
  phone: z.string().min(1, "Phone number is required."),
  email: z.string().email("Please enter a valid email address."),
  isEmergencyContact: z.boolean(),
})

export type FamilyMemberFormValues = z.infer<typeof familyMemberSchema>

export const familyMemberDefaultValues: FamilyMemberFormValues = {
  firstName: "",
  lastName: "",
  relationship: "",
  dateOfBirth: undefined as unknown as Date,
  phone: "",
  email: "",
  isEmergencyContact: false,
}

export const initialFamilyMembers: FamilyMember[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Smith",
    relationship: "Spouse",
    dateOfBirth: "04/12/1990",
    phone: "(555) 234-5678",
    email: "sarah.smith@email.com",
    isEmergencyContact: true,
  },
  {
    id: "2",
    firstName: "Emma",
    lastName: "Smith",
    relationship: "Child",
    dateOfBirth: "08/21/2012",
    phone: "(555) 345-6789",
    email: "emma.smith@email.com",
    isEmergencyContact: false,
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Smith",
    relationship: "Parent",
    dateOfBirth: "02/03/1962",
    phone: "(555) 456-7890",
    email: "robert.smith@email.com",
    isEmergencyContact: true,
  },
]

export const FAMILY_MEMBERS_STORAGE_KEY = "uhc-family-members"

export function getFamilyMembersFromStorage(): FamilyMember[] {
  if (typeof window === "undefined") return initialFamilyMembers

  try {
    const stored = localStorage.getItem(FAMILY_MEMBERS_STORAGE_KEY)
    if (!stored) return initialFamilyMembers
    return JSON.parse(stored) as FamilyMember[]
  } catch {
    return initialFamilyMembers
  }
}

export function saveFamilyMembersToStorage(members: FamilyMember[]) {
  localStorage.setItem(FAMILY_MEMBERS_STORAGE_KEY, JSON.stringify(members))
}

export function getFamilyMemberById(id: string): FamilyMember | undefined {
  return getFamilyMembersFromStorage().find((member) => member.id === id)
}

export function formatFamilyMemberDate(date: Date): string {
  return format(date, "MM/dd/yyyy")
}

export function parseFamilyMemberDate(
  value: string | null | undefined
): Date | undefined {
  if (!value) return undefined
  const parsed = parse(value, "MM/dd/yyyy", new Date())
  return isValid(parsed) ? parsed : undefined
}

export function memberToFormValues(
  member: FamilyMember
): FamilyMemberFormValues {
  return {
    firstName: member.firstName,
    lastName: member.lastName,
    relationship: member.relationship,
    dateOfBirth: parseFamilyMemberDate(member.dateOfBirth) as Date,
    phone: member.phone,
    email: member.email,
    isEmergencyContact: member.isEmergencyContact,
  }
}

export function formValuesToFamilyMember(
  values: FamilyMemberFormValues,
  id: string
): FamilyMember {
  return {
    id,
    firstName: values.firstName,
    lastName: values.lastName,
    relationship: values.relationship,
    dateOfBirth: formatFamilyMemberDate(values.dateOfBirth),
    phone: values.phone,
    email: values.email,
    isEmergencyContact: values.isEmergencyContact,
  }
}
