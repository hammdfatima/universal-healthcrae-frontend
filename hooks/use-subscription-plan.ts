import { useFetch } from "@/hooks/use-fetch"
import {
  SUBSCRIPTIONS_API,
  SUBSCRIPTIONS_QUERY_KEYS,
  type SubscriptionMeResponse,
} from "@/lib/api/subscriptions"
import {
  getFamilyMemberLimit,
  getFamilyNavLabel,
  getFamilyPageCopy,
  getPlanTier,
  type PlanTier,
  supportsFamilyMembers,
} from "@/lib/subscription/plan-tier"

export function useSubscriptionPlan() {
  const { data, isLoading, isError } = useFetch<SubscriptionMeResponse>({
    path: SUBSCRIPTIONS_API.me,
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.me,
  })

  const planName = data?.subscription?.plan.planName ?? null
  const tier: PlanTier | null = getPlanTier(planName)

  return {
    planName,
    tier,
    isLoading,
    isError,
    isActive: data?.isActive ?? false,
    supportsFamilyMembers: supportsFamilyMembers(tier),
    memberLimit: getFamilyMemberLimit(tier),
    navLabel: getFamilyNavLabel(tier),
    pageCopy: getFamilyPageCopy(tier),
  }
}
