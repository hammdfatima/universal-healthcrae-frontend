import { z } from "zod"

export type BillingCycle = "monthly" | "yearly"

export type SubscriptionPlan = {
  id: string
  planName: string
  price: string
  billingCycle: BillingCycle
  features: string[]
  memberLimit: number
  allowsPets: boolean
  createdAt: string
  updatedAt: string
}

export type SubscriptionPlanPayload = {
  planName: string
  price: string
  billingCycle: BillingCycle
  features: string[]
  memberLimit: number
  allowsPets: boolean
}

export const billingCycleOptions = [
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
] as const

export const subscriptionPlanSchema = z.object({
  planName: z.string().min(1, "Plan name is required."),
  price: z
    .string()
    .min(1, "Price is required.")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Enter a valid amount (numbers only, up to 2 decimals)."
    )
    .refine((value) => Number.parseFloat(value) > 0, {
      message: "Price must be greater than 0.",
    }),
  billingCycle: z.enum(["monthly", "yearly"], {
    message: "Select a billing cycle.",
  }),
  memberLimit: z.coerce
    .number()
    .int("Member limit must be a whole number.")
    .min(0, "Member limit cannot be negative."),
  allowsPets: z.boolean(),
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
  memberLimit: 0,
  allowsPets: false,
  features: "",
}

/** Strip currency symbols / letters; keep digits and at most one decimal. */
export function sanitizePriceInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "")
  const [whole = "", ...fractionParts] = cleaned.split(".")
  if (fractionParts.length === 0) {
    return whole
  }
  return `${whole}.${fractionParts.join("").slice(0, 2)}`
}

/** Form stores numeric amount only; DB/API keep `$9.95` display format. */
export function priceToFormAmount(price: string): string {
  return sanitizePriceInput(price)
}

export function formatPriceWithDollar(amount: string): string {
  const numeric = sanitizePriceInput(amount.trim())
  if (!numeric) {
    return ""
  }
  const parsed = Number.parseFloat(numeric)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return `$${numeric}`
  }
  return `$${parsed.toFixed(2)}`
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
    price: priceToFormAmount(plan.price),
    billingCycle: plan.billingCycle,
    memberLimit: plan.memberLimit,
    allowsPets: plan.allowsPets,
    features: featuresToTextarea(plan.features),
  }
}

export function formValuesToPayload(
  values: SubscriptionPlanFormValues
): SubscriptionPlanPayload {
  return {
    planName: values.planName.trim(),
    price: formatPriceWithDollar(values.price),
    billingCycle: values.billingCycle,
    memberLimit: Number(values.memberLimit),
    allowsPets: Boolean(values.allowsPets),
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
