import { z } from "zod"

export const ALLERGY_TYPE_FOOD = "Food"

export const allergyTypeOptions = [
  { label: "Food", value: "Food" },
  { label: "Drug", value: "Drug" },
  { label: "Skin", value: "Skin" },
  { label: "Dust", value: "Dust" },
  { label: "Pet", value: "Pet" },
  { label: "Eye", value: "Eye" },
  { label: "Insect", value: "Insect" },
  { label: "Rhinitis", value: "Rhinitis" },
  { label: "Mold", value: "Mold" },
  { label: "Sinus", value: "Sinus" },
] as const

export const natureOptions = [
  { label: "Very Mild", value: "Very Mild" },
  { label: "Mild", value: "Mild" },
  { label: "Moderate", value: "Moderate" },
  { label: "Severe", value: "Severe" },
  { label: "Very Severe", value: "Very Severe" },
] as const

export const symptomOptions = [
  "Vomiting",
  "Stomach cramps",
  "Shortness of breath",
  "Wheezing",
  "Repetitive cough",
  "Shock or circulatory collapse",
  "Tight, hoarse throat; trouble swallowing",
  "Rash",
  "Weak pulse",
  "Hives",
  "Dizziness or feeling faint",
  "Nausea",
  "Rapid heart beat",
  "Abdominal pain",
  "Diarrhea",
  "Fainting",
  "Swelling of the tongue, affecting the ability to talk or breathe",
  "Pale or blue coloring of skin",
] as const

export const foodTriggerOptions = [
  "Eggs",
  "Milk",
  "Tree Nuts",
  "Shellfish",
  "Wheat",
] as const

export type Allergy = {
  id: string
  allergyType: string
  nature: string
  symptoms: string[]
  triggers: string[]
}

export const allergySchema = z
  .object({
    allergyType: z.string().min(1, "Select an allergy type."),
    nature: z.string().min(1, "Select a severity level."),
    symptoms: z.array(z.string()).min(1, "Select at least one symptom."),
    triggers: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    if (data.allergyType === ALLERGY_TYPE_FOOD && data.triggers.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select at least one food trigger.",
        path: ["triggers"],
      })
    }
  })

export type AllergyFormValues = z.infer<typeof allergySchema>

export const allergyDefaultValues: AllergyFormValues = {
  allergyType: "",
  nature: "",
  symptoms: [],
  triggers: [],
}

export const initialAllergies: Allergy[] = [
  {
    id: "1",
    allergyType: "Drug",
    nature: "Severe",
    symptoms: ["Hives", "Shortness of breath", "Weak pulse"],
    triggers: [],
  },
  {
    id: "2",
    allergyType: "Food",
    nature: "Moderate",
    symptoms: [
      "Swelling of the tongue, affecting the ability to talk or breathe",
      "Wheezing",
      "Dizziness or feeling faint",
    ],
    triggers: ["Shellfish"],
  },
]

export const ALLERGIES_STORAGE_KEY = "uhc-allergies"

export function getAllergiesFromStorage(): Allergy[] {
  if (typeof window === "undefined") return initialAllergies

  try {
    const stored = localStorage.getItem(ALLERGIES_STORAGE_KEY)
    if (!stored) return initialAllergies
    return JSON.parse(stored) as Allergy[]
  } catch {
    return initialAllergies
  }
}

export function saveAllergiesToStorage(allergies: Allergy[]) {
  localStorage.setItem(ALLERGIES_STORAGE_KEY, JSON.stringify(allergies))
}

export function getAllergyById(id: string): Allergy | undefined {
  return getAllergiesFromStorage().find((allergy) => allergy.id === id)
}

export function allergyToFormValues(allergy: Allergy): AllergyFormValues {
  return {
    allergyType: allergy.allergyType,
    nature: allergy.nature,
    symptoms: allergy.symptoms,
    triggers: allergy.triggers,
  }
}

export function formValuesToAllergy(
  values: AllergyFormValues,
  id: string
): Allergy {
  return {
    id,
    allergyType: values.allergyType,
    nature: values.nature,
    symptoms: values.symptoms,
    triggers: values.allergyType === ALLERGY_TYPE_FOOD ? values.triggers : [],
  }
}

export function getAllergyTypeFilterOptions(allergies: Allergy[]) {
  const types = [...new Set(allergies.map((a) => a.allergyType))]
  return types.map((type) => ({ label: type, value: type }))
}

export function formatSymptomsList(symptoms: string[], max = 2): string {
  if (symptoms.length === 0) return "—"
  if (symptoms.length <= max) return symptoms.join(", ")
  return `${symptoms.slice(0, max).join(", ")} +${symptoms.length - max} more`
}

export function formatTriggersList(triggers: string[]): string {
  if (triggers.length === 0) return "—"
  return triggers.join(", ")
}
