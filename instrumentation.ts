/**
 * When Render wakes this Next.js process, immediately ping the API so both
 * free-tier services come up together instead of waiting for the first
 * login/API call.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") {
    return
  }

  const { pingBackendHealth } = await import("@/lib/wake-backend")

  const ping = () => {
    void pingBackendHealth(20_000)
  }

  ping()

  if (process.env.NODE_ENV !== "production") {
    return
  }

  const globalState = globalThis as typeof globalThis & {
    __backendKeepAlive?: ReturnType<typeof setInterval>
  }

  if (globalState.__backendKeepAlive) {
    return
  }

  // Render free web services sleep after ~15 minutes with no inbound HTTP.
  // Keep the API warm for as long as this frontend process is itself awake.
  globalState.__backendKeepAlive = setInterval(ping, 8 * 60 * 1000)
}
