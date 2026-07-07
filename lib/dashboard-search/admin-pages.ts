import {
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Tags,
  Users,
} from "lucide-react"
import type { Route } from "next"

import type { PortalSearchResult } from "@/lib/dashboard-search/types"

function pageResult(
  id: string,
  title: string,
  href: Route,
  group: string,
  icon: PortalSearchResult["icon"],
  keywords: string[] = []
): PortalSearchResult {
  return {
    id,
    title,
    href,
    group,
    icon,
    keywords: [title, group, ...keywords].join(" ").toLowerCase(),
  }
}

export const ADMIN_SEARCH_PAGES: PortalSearchResult[] = [
  pageResult("page-overview", "Overview", "/admin", "Pages", LayoutDashboard, [
    "dashboard",
    "home",
    "stats",
  ]),
  pageResult("page-users", "Users", "/admin/users", "Pages", Users, [
    "patients",
    "accounts",
    "members",
  ]),
  pageResult(
    "page-subscription-plans",
    "Subscription Plans",
    "/admin/subscription-plans",
    "Pages",
    Tags,
    ["plans", "pricing", "subscriptions"]
  ),
  pageResult(
    "page-payments",
    "Payments",
    "/admin/payments",
    "Pages",
    CreditCard,
    ["invoices", "billing", "transactions"]
  ),
  pageResult(
    "page-user-queries",
    "User Queries",
    "/admin/user-queries",
    "Pages",
    MessageSquare,
    ["support", "contact", "messages", "inquiries"]
  ),
  pageResult(
    "page-settings",
    "Settings",
    "/admin/settings",
    "Pages",
    Settings,
    ["profile", "account", "password"]
  ),
]
