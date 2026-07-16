export type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "inactive"
  | "past_due"
  | "trialing"
  | "incomplete"

export type UserSubscriptionPlan = {
  id: string
  planName: string
  price: string
  billingCycle: "monthly" | "yearly"
  features: string[]
  memberLimit: number
  allowsPets: boolean
}

export type UserSubscription = {
  id: string
  status: SubscriptionStatus
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  plan: UserSubscriptionPlan
  scheduledPlan?: UserSubscriptionPlan | null
  scheduledPlanChangeAt?: string | null
}

export type SubscriptionMeResponse = {
  subscription: UserSubscription | null
  isActive: boolean
}

export type CheckoutSessionResponse = {
  checkoutUrl: string
  sessionId: string
}

export type PlanChangeType = "upgrade" | "downgrade" | "reactivate" | "new"

export type ChangePlanPreview = {
  mode: "updated" | "scheduled" | "checkout"
  changeType: PlanChangeType
  currentPlan: UserSubscriptionPlan | null
  targetPlan: UserSubscriptionPlan
  amountDueCents: number
  amountDueFormatted: string
  creditCents: number
  creditFormatted: string | null
  effectiveAt: string | null
  summary: string
}

export type ChangePlanResponse =
  | {
      mode: "updated"
      changeType: PlanChangeType
      amountDueCents: number
      amountDueFormatted: string
      effectiveAt: string | null
      subscription: UserSubscription
      isActive: boolean
      summary: string
    }
  | {
      mode: "scheduled"
      changeType: PlanChangeType
      amountDueCents: number
      amountDueFormatted: string
      effectiveAt: string | null
      subscription: UserSubscription
      isActive: boolean
      summary: string
    }
  | {
      mode: "checkout"
      changeType: PlanChangeType
      amountDueCents: number
      amountDueFormatted: string
      effectiveAt: string | null
      checkoutUrl: string
      sessionId: string
      summary: string
    }

export const SUBSCRIPTIONS_API = {
  me: "/subscriptions/me",
  checkout: "/subscriptions/checkout",
  cancel: "/subscriptions/cancel",
  changePlan: "/subscriptions/change-plan",
  changePlanPreview: "/subscriptions/change-plan/preview",
  verifyCheckout: (sessionId: string) =>
    `/subscriptions/checkout/verify?session_id=${encodeURIComponent(sessionId)}`,
} as const

export const SUBSCRIPTIONS_QUERY_KEYS = {
  me: ["subscriptions", "me"] as const,
}
