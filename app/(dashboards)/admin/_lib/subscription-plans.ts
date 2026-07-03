import { z } from "zod"

export type BillingCycle = "monthly" | "yearly"

export type SubscriptionPlan = {
  id: string
  planName: string
  price: string
  billingCycle: BillingCycle
  features: string[]
  createdAt: string
  updatedAt: string
}

export type SubscriptionPlanPayload = {
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

export function formValuesToPayload(
  values: SubscriptionPlanFormValues
): SubscriptionPlanPayload {
  return {
    planName: values.planName.trim(),
    price: values.price.trim(),
    billingCycle: values.billingCycle,
    features: textareaToFeatures(values.features),
  }
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
