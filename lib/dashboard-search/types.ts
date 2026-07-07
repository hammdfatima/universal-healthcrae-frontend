import type { LucideIcon } from "lucide-react"
import type { Route } from "next"

export type PortalSearchResult = {
  id: string
  title: string
  subtitle?: string
  href: Route
  group: string
  keywords: string
  icon?: LucideIcon
}

export type PortalSearchPortal = "patient" | "admin"

export function filterSearchResults(
  results: PortalSearchResult[],
  query: string
) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return results
  }

  return results.filter((result) =>
    result.keywords.toLowerCase().includes(normalized)
  )
}

export function groupSearchResults(results: PortalSearchResult[]) {
  const groups = new Map<string, PortalSearchResult[]>()

  for (const result of results) {
    const existing = groups.get(result.group) ?? []
    existing.push(result)
    groups.set(result.group, existing)
  }

  return Array.from(groups.entries()).map(([heading, items]) => ({
    heading,
    items,
  }))
}
