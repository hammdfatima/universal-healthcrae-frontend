import { getBackendOrigin } from "@/lib/backend-url"

/**
 * Any HTTP hit to the Render service URL starts a spin-up. `/health/ready`
 * also warms Neon; `/health` is the cheap process check used if ready is
 * missing or still starting.
 */
export async function pingBackendHealth(timeoutMs = 50_000): Promise<boolean> {
  const origin = getBackendOrigin()
  const readyUrl = `${origin}/health/ready`
  const healthUrl = `${origin}/health`
  const headers = { "user-agent": "universal-healthcare-frontend-wake" }

  try {
    const ready = await fetch(readyUrl, {
      cache: "no-store",
      headers,
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (ready.ok) {
      return true
    }
    if (ready.status !== 404) {
      return false
    }
  } catch {
    // Process is likely still sleeping; fall through so `/health` also wakes it.
  }

  try {
    const health = await fetch(healthUrl, {
      cache: "no-store",
      headers,
      signal: AbortSignal.timeout(timeoutMs),
    })
    return health.ok
  } catch {
    return false
  }
}
