import { z } from "zod"

import { pricingPlans } from "@/app/_lib/pricing-plans-data"

export type BillingCycle = "monthly" | "yearly"

export type SubscriptionPlan = {
  id: string
  planName: string
  price: string
  billingCycle: BillingCycle
  features: string[]
}

export const billingCycleOptions = [
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
] as const

export const subscriptionPlanSchema = z.object({
  planName: z.string().min(1, "Plan name is required."),
  price: z.string().min(1, "Price is required."),
  billingCycle: z.enum(["monthly", "yearly"], {
    message: "Select a billing cycle.",
  }),
  features: z
    .string()
    .min(1, "Enter at least one feature.")
    .refine((value) => textareaToFeatures(value).length > 0, {
      message: "Enter at least one feature.",
    }),
})

export type SubscriptionPlanFormValues = z.infer<typeof subscriptionPlanSchema>

export const subscriptionPlanDefaultValues: SubscriptionPlanFormValues = {
  planName: "",
  price: "",
  billingCycle: "monthly",
  features: "",
}

export const initialSubscriptionPlans: SubscriptionPlan[] = pricingPlans.map(
  (plan, index) => ({
    id: String(index + 1),
    planName: plan.name,
    price: plan.price,
    billingCycle: "monthly",
    features: [...plan.features],
  })
)

export const SUBSCRIPTION_PLANS_STORAGE_KEY = "uhc-admin-subscription-plans"

export function textareaToFeatures(text: string): string[] {
  return text
    .split("\n")
    .map((feature) => feature.trim())
    .filter(Boolean)
}

export function featuresToTextarea(features: string[]): string {
  return features.join("\n")
}

export function planToFormValues(
  plan: SubscriptionPlan
): SubscriptionPlanFormValues {
  return {
    planName: plan.planName,
    price: plan.price,
    billingCycle: plan.billingCycle,
    features: featuresToTextarea(plan.features),
  }
}

export function formValuesToPlan(
  values: SubscriptionPlanFormValues,
  id?: string
): SubscriptionPlan {
  return {
    id: id ?? crypto.randomUUID(),
    planName: values.planName.trim(),
    price: values.price.trim(),
    billingCycle: values.billingCycle,
    features: textareaToFeatures(values.features),
  }
}

export function getSubscriptionPlansFromStorage(): SubscriptionPlan[] {
  if (typeof window === "undefined") return initialSubscriptionPlans

  try {
    const stored = localStorage.getItem(SUBSCRIPTION_PLANS_STORAGE_KEY)
    if (!stored) return initialSubscriptionPlans
    return JSON.parse(stored) as SubscriptionPlan[]
  } catch {
    return initialSubscriptionPlans
  }
}

export function saveSubscriptionPlansToStorage(plans: SubscriptionPlan[]) {
  localStorage.setItem(SUBSCRIPTION_PLANS_STORAGE_KEY, JSON.stringify(plans))
}

export function formatBillingCycle(cycle: BillingCycle): string {
  return cycle === "monthly" ? "Monthly" : "Yearly"
}

export function getBillingCycleFilterOptions(plans: SubscriptionPlan[]) {
  const cycles = [...new Set(plans.map((plan) => plan.billingCycle))]
  return cycles.map((cycle) => ({
    label: formatBillingCycle(cycle),
    value: cycle,
  }))
}
