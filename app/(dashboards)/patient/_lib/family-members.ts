import { z } from "zod"

import { strongPasswordSchema } from "@/lib/auth/password"

export const relationshipOptions = [
  { label: "Spouse", value: "Spouse" },
  { label: "Child", value: "Child" },
  { label: "Parent", value: "Parent" },
  { label: "Sibling", value: "Sibling" },
] as const

export const familyMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  relationship: z.string().min(1, "Relationship is required."),
  phone: z.string().min(1, "Phone number is required."),
  email: z.string().email("Please enter a valid email address."),
  isEmergencyContact: z.boolean(),
})

export const familyMemberCreateSchema = familyMemberSchema.extend({
  password: strongPasswordSchema,
})

export type FamilyMemberFormValues = z.infer<typeof familyMemberSchema>
export type FamilyMemberCreateFormValues = z.infer<
  typeof familyMemberCreateSchema
>

export const familyMemberDefaultValues: FamilyMemberFormValues = {
  firstName: "",
  lastName: "",
  relationship: "",
  phone: "",
  email: "",
  isEmergencyContact: false,
}

export function memberToFormValues(member: {
  firstName: string
  lastName: string
  relationship: string
  phone: string | null
  email: string
  isEmergencyContact: boolean
}): FamilyMemberFormValues {
  return {
    firstName: member.firstName,
    lastName: member.lastName,
    relationship: member.relationship,
    phone: member.phone ?? "",
    email: member.email,
    isEmergencyContact: member.isEmergencyContact,
  }
}
