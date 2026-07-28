import { env } from "@/env"

/**
 * Browser requests always use the same-origin `/api/v1` proxy so the httpOnly
 * auth cookie is first-party. That is required for reliable mobile login when
 * the API is hosted on a different site (e.g. *.onrender.com).
 */
export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return "/api/v1"
  }

  return env.NEXT_PUBLIC_API_URL
}
