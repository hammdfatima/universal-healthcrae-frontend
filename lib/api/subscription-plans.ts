import type { SubscriptionPlan } from "@/app/(dashboards)/admin/_lib/subscription-plans"

export const SUBSCRIPTION_PLANS_API = {
  public: {
    list: "/subscription-plans",
  },
  admin: {
    list: "/admin/subscription-plans",
    create: "/admin/subscription-plans",
    update: (id: string) => `/admin/subscription-plans/${id}`,
    delete: (id: string) => `/admin/subscription-plans/${id}`,
  },
} as const

export const SUBSCRIPTION_PLANS_QUERY_KEYS = {
  admin: ["subscription-plans", "admin"] as const,
  public: ["subscription-plans", "public"] as const,
}

type UnknownPlan = Record<string, unknown>

function isBillingCycle(value: unknown): value is "monthly" | "yearly" {
  return value === "monthly" || value === "yearly"
}

function normalizePlan(plan: UnknownPlan): SubscriptionPlan | null {
  if (
    typeof plan.id !== "string" ||
    typeof plan.planName !== "string" ||
    typeof plan.price !== "string" ||
    !isBillingCycle(plan.billingCycle)
  ) {
    return null
  }

  return {
    id: plan.id,
    planName: plan.planName,
    price: plan.price,
    billingCycle: plan.billingCycle,
    features: Array.isArray(plan.features)
      ? plan.features.filter(
          (feature): feature is string => typeof feature === "string"
        )
      : [],
    memberLimit:
      typeof plan.memberLimit === "number" && Number.isFinite(plan.memberLimit)
        ? plan.memberLimit
        : 0,
    allowsPets: Boolean(plan.allowsPets),
    createdAt: typeof plan.createdAt === "string" ? plan.createdAt : "",
    updatedAt: typeof plan.updatedAt === "string" ? plan.updatedAt : "",
  }
}

export function normalizeSubscriptionPlans(value: unknown): SubscriptionPlan[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter(
      (plan): plan is UnknownPlan => Boolean(plan) && typeof plan === "object"
    )
    .map(normalizePlan)
    .filter((plan): plan is SubscriptionPlan => plan !== null)
}
