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
