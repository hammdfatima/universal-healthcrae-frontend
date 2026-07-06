export type PlanTier = "individual" | "couple" | "family"

export function getPlanTier(planName?: string | null): PlanTier | null {
  if (!planName) return null

  const normalized = planName.toLowerCase()

  if (normalized.includes("family")) return "family"
  if (normalized.includes("couple")) return "couple"
  if (normalized.includes("individual")) return "individual"

  return null
}

export function supportsFamilyMembers(tier: PlanTier | null): boolean {
  return tier === "couple" || tier === "family"
}

export function getFamilyMemberLimit(tier: PlanTier | null): number {
  if (tier === "couple") return 1
  if (tier === "family") return 6
  return 0
}

export function getFamilyNavLabel(tier: PlanTier | null): string {
  return tier === "couple" ? "My Spouse" : "My Family"
}

export function getFamilyPageCopy(tier: PlanTier | null) {
  if (tier === "couple") {
    return {
      title: "My Spouse",
      description:
        "Manage your spouse's profile linked to your health records and emergency contacts.",
      addButton: "Add Spouse",
      addTitle: "Add Spouse",
      addDescription:
        "Add your spouse to your health profile and optionally mark them as an emergency contact.",
      saveLabel: "Save Spouse",
      searchPlaceholder: "Search spouse profile...",
      emptyMessage:
        "No spouse profile added yet. Add your spouse to get started.",
      memberSingular: "spouse",
      memberPlural: "spouse",
    }
  }

  return {
    title: "My Family",
    description:
      "Manage family members linked to your health records and emergency contacts.",
    addButton: "Add Family Member",
    addTitle: "Add Family Member",
    addDescription:
      "Add a family member to your health profile and optionally mark them as an emergency contact.",
    saveLabel: "Save Member",
    searchPlaceholder: "Search family members...",
    emptyMessage:
      "No family members found. Add your first family member to get started.",
    memberSingular: "family member",
    memberPlural: "family members",
  }
}
