import { env } from "@/env"

export function getApiBaseUrl() {
  return env.NEXT_PUBLIC_API_URL
}
