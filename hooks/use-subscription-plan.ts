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
  getPlanTierFromCapabilities,
  type PlanCapabilities,
  type PlanTier,
  supportsFamilyMembers,
  supportsPets,
} from "@/lib/subscription/plan-tier"

export function useSubscriptionPlan() {
  const { data, isLoading, isError } = useFetch<SubscriptionMeResponse>({
    path: SUBSCRIPTIONS_API.me,
    queryKey: SUBSCRIPTIONS_QUERY_KEYS.me,
  })

  const plan = data?.subscription?.plan ?? null
  const capabilities: PlanCapabilities | null = plan
    ? {
        memberLimit: plan.memberLimit ?? 0,
        allowsPets: plan.allowsPets ?? false,
      }
    : null

  const tier: PlanTier | null = getPlanTierFromCapabilities(capabilities)

  return {
    planName: plan?.planName ?? null,
    tier,
    isLoading,
    isError,
    isActive: data?.isActive ?? false,
    memberLimit: getFamilyMemberLimit(capabilities),
    supportsFamilyMembers: supportsFamilyMembers(capabilities),
    supportsPets: supportsPets(capabilities),
    navLabel: getFamilyNavLabel(tier),
    pageCopy: getFamilyPageCopy(tier),
  }
}
