import type {
  FamilyConditionEntry,
  FamilyLifestyleHistory,
  SubstanceEntry,
} from "@/app/(dashboards)/patient/_lib/family-lifestyle-history"

export type FamilyLifestyleHistoryResponse = {
  familyLifestyleHistory: FamilyLifestyleHistory
}

export type UpsertFamilyLifestyleHistoryPayload = {
  substances: SubstanceEntry[]
  familyHistory: FamilyConditionEntry[]
}

export const FAMILY_LIFESTYLE_HISTORY_API = {
  get: "/family-lifestyle-history",
  upsert: "/family-lifestyle-history",
} as const

export const FAMILY_LIFESTYLE_HISTORY_QUERY_KEYS = {
  detail: ["family-lifestyle-history", "detail"] as const,
}
