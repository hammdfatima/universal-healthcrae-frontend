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
}

export type UserSubscription = {
  id: string
  status: SubscriptionStatus
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  plan: UserSubscriptionPlan
}

export type SubscriptionMeResponse = {
  subscription: UserSubscription | null
  isActive: boolean
}

export type CheckoutSessionResponse = {
  checkoutUrl: string
  sessionId: string
}

export type ChangePlanResponse =
  | {
      mode: "updated"
      subscription: UserSubscription
      isActive: boolean
    }
  | {
      mode: "checkout"
      checkoutUrl: string
      sessionId: string
    }

export const SUBSCRIPTIONS_API = {
  me: "/subscriptions/me",
  checkout: "/subscriptions/checkout",
  cancel: "/subscriptions/cancel",
  changePlan: "/subscriptions/change-plan",
  verifyCheckout: (sessionId: string) =>
    `/subscriptions/checkout/verify?session_id=${encodeURIComponent(sessionId)}`,
} as const

export const SUBSCRIPTIONS_QUERY_KEYS = {
  me: ["subscriptions", "me"] as const,
}
