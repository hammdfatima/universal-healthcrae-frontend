export const SUBSTANCE_KEYS = [
  "caffeine",
  "smoking",
  "alcohol",
  "drug",
] as const

export const FAMILY_RELATION_KEYS = [
  "grandparents",
  "father",
  "mother",
  "brothers",
  "sisters",
  "sons",
  "daughters",
] as const

export const FAMILY_CONDITION_KEYS = [
  "cancer",
  "heart_disease",
  "diabetes",
  "stroke_tia",
  "high_blood_pressure",
  "high_cholesterol",
  "liver_disease",
  "alcohol_drug_abuse",
  "anxiety_depression_psychiatric",
  "tuberculosis",
  "anesthesia_complications",
  "genetic_disorder",
] as const

export type SubstanceKey = (typeof SUBSTANCE_KEYS)[number]
export type FamilyRelationKey = (typeof FAMILY_RELATION_KEYS)[number]
export type FamilyConditionKey = (typeof FAMILY_CONDITION_KEYS)[number]

export type FamilyRelations = Record<FamilyRelationKey, boolean>

export type SubstanceEntry = {
  id: SubstanceKey
  currentlyUsing: boolean
  previouslyUsing: boolean
  typeAmount: string
  durationYears: number
  stoppedYear: string
}

export type FamilyConditionEntry = {
  id: FamilyConditionKey
  relations: FamilyRelations
  details: string
}

export type FamilyLifestyleHistory = {
  substances: SubstanceEntry[]
  familyHistory: FamilyConditionEntry[]
  updatedAt: string | null
}

export const SUBSTANCE_LABELS: Record<SubstanceKey, string> = {
  caffeine: "Caffeine (tea, coffee)",
  smoking: "Smokings",
  alcohol: "Alcohol",
  drug: "Drug",
}

export const FAMILY_RELATION_LABELS: Record<FamilyRelationKey, string> = {
  grandparents: "Grandparents",
  father: "Father",
  mother: "Mother",
  brothers: "Brothers",
  sisters: "Sisters",
  sons: "Sons",
  daughters: "Daughters",
}

export const FAMILY_CONDITION_LABELS: Record<FamilyConditionKey, string> = {
  cancer: "Cancer",
  heart_disease: "Heart Disease",
  diabetes: "Diabetes",
  stroke_tia: "Stroke/TIA",
  high_blood_pressure: "High Blood Pressure",
  high_cholesterol: "High Cholesterol or Triglycerides",
  liver_disease: "Liver Disease",
  alcohol_drug_abuse: "Alcohol or Drug Abuse",
  anxiety_depression_psychiatric: "Anxiety, Depression or Psychiatric Illness",
  tuberculosis: "Tuberculosis",
  anesthesia_complications: "Anesthesia Complications",
  genetic_disorder: "Genetic Disorder",
}

export const DURATION_YEAR_OPTIONS = Array.from({ length: 50 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}))

function createDefaultSubstances(): SubstanceEntry[] {
  return SUBSTANCE_KEYS.map((id) => ({
    id,
    currentlyUsing: false,
    previouslyUsing: false,
    typeAmount: "",
    durationYears: 1,
    stoppedYear: "",
  }))
}

function createDefaultFamilyHistory(): FamilyConditionEntry[] {
  return FAMILY_CONDITION_KEYS.map((id) => ({
    id,
    relations: {
      grandparents: false,
      father: false,
      mother: false,
      brothers: false,
      sisters: false,
      sons: false,
      daughters: false,
    },
    details: "",
  }))
}

export function createDefaultFamilyLifestyleHistory(): FamilyLifestyleHistory {
  return {
    substances: createDefaultSubstances(),
    familyHistory: createDefaultFamilyHistory(),
    updatedAt: null,
  }
}

export function isSubstanceEntryFilled(entry: SubstanceEntry): boolean {
  return (
    entry.currentlyUsing ||
    entry.previouslyUsing ||
    Boolean(entry.typeAmount.trim()) ||
    Boolean(entry.stoppedYear.trim())
  )
}

export function countFamilyLifestyleHistoryEntries(
  history: FamilyLifestyleHistory
) {
  const substanceCount = history.substances.filter(
    isSubstanceEntryFilled
  ).length

  const familyCount = history.familyHistory.filter(
    (entry) =>
      entry.details.trim() || Object.values(entry.relations).some(Boolean)
  ).length

  return substanceCount + familyCount
}

export function formatFamilyConditionSummary(entry: FamilyConditionEntry) {
  const relations = FAMILY_RELATION_KEYS.filter((key) => entry.relations[key])
    .map((key) => FAMILY_RELATION_LABELS[key])
    .join(", ")

  if (relations && entry.details.trim()) {
    return `${relations} · ${entry.details.trim()}`
  }

  return relations || entry.details.trim() || "—"
}

export function parseFamilyLifestyleHistoryFromExport(
  value: Record<string, unknown> | undefined | null
): FamilyLifestyleHistory {
  if (!value || typeof value !== "object") {
    return createDefaultFamilyLifestyleHistory()
  }

  const defaults = createDefaultFamilyLifestyleHistory()
  const rawSubstances = value.substances
  const substances = Array.isArray(rawSubstances)
    ? defaults.substances.map((defaultEntry) => {
        const match = rawSubstances.find(
          (item: unknown) =>
            item &&
            typeof item === "object" &&
            "id" in item &&
            (item as { id?: unknown }).id === defaultEntry.id
        )

        if (!match || typeof match !== "object") {
          return defaultEntry
        }

        const record = match as Record<string, unknown>

        return {
          ...defaultEntry,
          currentlyUsing: Boolean(record.currentlyUsing),
          previouslyUsing: Boolean(record.previouslyUsing),
          typeAmount:
            typeof record.typeAmount === "string" ? record.typeAmount : "",
          durationYears:
            typeof record.durationYears === "number"
              ? record.durationYears
              : defaultEntry.durationYears,
          stoppedYear:
            typeof record.stoppedYear === "string" ? record.stoppedYear : "",
        }
      })
    : defaults.substances

  const rawFamilyHistory = value.familyHistory
  const familyHistory = Array.isArray(rawFamilyHistory)
    ? defaults.familyHistory.map((defaultEntry) => {
        const match = rawFamilyHistory.find(
          (item: unknown) =>
            item &&
            typeof item === "object" &&
            "id" in item &&
            (item as { id?: unknown }).id === defaultEntry.id
        )

        if (!match || typeof match !== "object") {
          return defaultEntry
        }

        const record = match as Record<string, unknown>
        const relationsRecord =
          record.relations && typeof record.relations === "object"
            ? (record.relations as Record<string, unknown>)
            : {}

        return {
          ...defaultEntry,
          relations: {
            grandparents: Boolean(relationsRecord.grandparents),
            father: Boolean(relationsRecord.father),
            mother: Boolean(relationsRecord.mother),
            brothers: Boolean(relationsRecord.brothers),
            sisters: Boolean(relationsRecord.sisters),
            sons: Boolean(relationsRecord.sons),
            daughters: Boolean(relationsRecord.daughters),
          },
          details: typeof record.details === "string" ? record.details : "",
        }
      })
    : defaults.familyHistory

  return {
    substances,
    familyHistory,
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : defaults.updatedAt,
  }
}

export function formatSubstanceSummary(entry: SubstanceEntry) {
  if (!isSubstanceEntryFilled(entry)) {
    return "—"
  }

  const parts: string[] = []

  if (entry.currentlyUsing) parts.push("Currently using")
  if (entry.previouslyUsing) parts.push("Previously using")
  if (entry.typeAmount.trim()) parts.push(entry.typeAmount.trim())
  if (entry.durationYears) parts.push(`${entry.durationYears} year(s)`)
  if (entry.stoppedYear.trim())
    parts.push(`Stopped ${entry.stoppedYear.trim()}`)

  return parts.join(" · ") || "—"
}
