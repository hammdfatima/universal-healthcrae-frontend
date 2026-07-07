"use client"

import type { Route } from "next"
import { useMemo } from "react"
import type { SubscriptionPlan } from "@/app/(dashboards)/admin/_lib/subscription-plans"
import type { AdminUser } from "@/app/(dashboards)/admin/_lib/users"
import { useFetch } from "@/hooks/use-fetch"
import {
  ADMIN_PAYMENTS_API,
  ADMIN_PAYMENTS_QUERY_KEYS,
  type AdminPaymentsListResponse,
} from "@/lib/api/admin-payments"
import {
  SUBSCRIPTION_PLANS_API,
  SUBSCRIPTION_PLANS_QUERY_KEYS,
} from "@/lib/api/subscription-plans"
import {
  USER_QUERIES_API,
  USER_QUERIES_QUERY_KEYS,
  type UserQueriesListResponse,
} from "@/lib/api/user-queries"
import { USERS_API, USERS_QUERY_KEYS } from "@/lib/api/users"
import { ADMIN_SEARCH_PAGES } from "@/lib/dashboard-search/admin-pages"
import type { PortalSearchResult } from "@/lib/dashboard-search/types"

function recordResult(
  id: string,
  title: string,
  href: PortalSearchResult["href"],
  group: string,
  subtitle?: string,
  keywords: string[] = []
): PortalSearchResult {
  return {
    id,
    title,
    subtitle,
    href,
    group,
    keywords: [title, subtitle, group, ...keywords]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  }
}

export function useAdminPortalSearch(enabled: boolean) {
  const usersQuery = useFetch<AdminUser[]>({
    path: USERS_API.admin.list,
    queryKey: USERS_QUERY_KEYS.admin,
    enabled,
  })
  const paymentsQuery = useFetch<AdminPaymentsListResponse>({
    path: ADMIN_PAYMENTS_API.list,
    queryKey: ADMIN_PAYMENTS_QUERY_KEYS.list,
    enabled,
  })
  const queriesQuery = useFetch<UserQueriesListResponse>({
    path: USER_QUERIES_API.admin.list,
    queryKey: USER_QUERIES_QUERY_KEYS.adminList,
    enabled,
  })
  const plansQuery = useFetch<SubscriptionPlan[]>({
    path: SUBSCRIPTION_PLANS_API.admin.list,
    queryKey: SUBSCRIPTION_PLANS_QUERY_KEYS.admin,
    enabled,
  })

  const recordResults = useMemo(() => {
    const results: PortalSearchResult[] = []

    for (const user of usersQuery.data ?? []) {
      results.push(
        recordResult(
          `user-${user.id}`,
          user.name,
          "/admin/users",
          "Users",
          user.email,
          [user.plan ?? "", user.status, user.email]
        )
      )
    }

    for (const payment of paymentsQuery.data?.payments ?? []) {
      results.push(
        recordResult(
          `payment-${payment.id}`,
          payment.invoiceNumber,
          `/admin/payments/${payment.id}` as Route,
          "Payments",
          `${payment.user} · ${payment.amount}`,
          [payment.email, payment.plan, payment.status, payment.transactionId]
        )
      )
    }

    for (const query of queriesQuery.data?.queries ?? []) {
      results.push(
        recordResult(
          `query-${query.id}`,
          query.subjectLabel,
          `/admin/user-queries/${query.id}` as Route,
          "User Queries",
          `${query.fullName} · ${query.email}`,
          [query.message, query.email, query.fullName]
        )
      )
    }

    for (const plan of plansQuery.data ?? []) {
      results.push(
        recordResult(
          `plan-${plan.id}`,
          plan.planName,
          "/admin/subscription-plans",
          "Subscription Plans",
          `${plan.price} · ${plan.billingCycle}`,
          plan.features
        )
      )
    }

    return results
  }, [
    paymentsQuery.data?.payments,
    plansQuery.data,
    queriesQuery.data?.queries,
    usersQuery.data,
  ])

  const isLoading =
    usersQuery.isLoading ||
    paymentsQuery.isLoading ||
    queriesQuery.isLoading ||
    plansQuery.isLoading

  return {
    pages: ADMIN_SEARCH_PAGES,
    records: recordResults,
    isLoading,
  }
}
