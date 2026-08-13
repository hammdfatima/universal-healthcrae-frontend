import { type NextRequest, NextResponse } from "next/server"

import { getBackendApiBaseUrl } from "@/lib/backend-url"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

/** Render free / Neon cold starts can take 30–60s before the API accepts traffic. */
const UPSTREAM_TIMEOUT_MS = 55_000
const UPSTREAM_RETRY_ATTEMPTS = 3
const UPSTREAM_RETRY_DELAY_MS = 1_500

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
])

type RouteContext = {
  params: Promise<{ path: string[] }>
}

/**
 * Cookies set through this same-origin proxy are first-party.
 * Prefer SameSite=Lax so mobile browsers keep the session after login.
 */
function rewriteAuthCookieForProxy(cookie: string) {
  let next = cookie.replace(/;\s*SameSite=None/gi, "; SameSite=Lax")
  if (!/;\s*SameSite=/i.test(next)) {
    next = `${next}; SameSite=Lax`
  }
  return next
}

function resolveClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim()
    if (first) {
      return first
    }
  }

  const candidates = [
    request.headers.get("x-real-ip"),
    request.headers.get("cf-connecting-ip"),
    request.headers.get("true-client-ip"),
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim(),
    (request as NextRequest & { ip?: string }).ip,
  ]

  for (const value of candidates) {
    const trimmed = value?.trim()
    if (trimmed) {
      return trimmed
    }
  }

  return null
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchUpstream(targetUrl: string, init: RequestInit) {
  let lastError: unknown

  for (let attempt = 1; attempt <= UPSTREAM_RETRY_ATTEMPTS; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

    try {
      return await fetch(targetUrl, {
        ...init,
        signal: controller.signal,
      })
    } catch (error) {
      lastError = error
      if (attempt < UPSTREAM_RETRY_ATTEMPTS) {
        await sleep(UPSTREAM_RETRY_DELAY_MS * attempt)
      }
    } finally {
      clearTimeout(timeout)
    }
  }

  throw lastError
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  const targetUrl = `${getBackendApiBaseUrl()}/${path.join("/")}${request.nextUrl.search}`

  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value)
    }
  })

  // Preserve the browser's IP through this same-origin BFF hop. Without this,
  // the API only sees the Next.js server address (often ::1 / 127.0.0.1).
  const clientIp = resolveClientIp(request)
  if (clientIp) {
    if (!headers.get("x-forwarded-for")) {
      headers.set("x-forwarded-for", clientIp)
    }
    headers.set("x-real-ip", clientIp)
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer()
  }

  let upstream: Response
  try {
    upstream = await fetchUpstream(targetUrl, init)
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to reach the API server. It may be waking from sleep — please try again in a moment.",
      },
      { status: 502 }
    )
  }

  const responseHeaders = new Headers()
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    // Node/Next may hand us a decoded response body. Forwarding the upstream
    // content metadata can then advertise the wrong byte length/encoding and
    // cause browsers to treat JSON payloads as truncated.
    if (
      lower === "transfer-encoding" ||
      lower === "set-cookie" ||
      lower === "content-length" ||
      lower === "content-encoding"
    ) {
      return
    }
    responseHeaders.set(key, value)
  })

  const setCookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : []

  if (setCookies.length > 0) {
    for (const cookie of setCookies) {
      responseHeaders.append("set-cookie", rewriteAuthCookieForProxy(cookie))
    }
  } else {
    const single = upstream.headers.get("set-cookie")
    if (single) {
      responseHeaders.append("set-cookie", rewriteAuthCookieForProxy(single))
    }
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  })
}

export const GET = proxyRequest
export const POST = proxyRequest
export const PUT = proxyRequest
export const PATCH = proxyRequest
export const DELETE = proxyRequest
export const OPTIONS = proxyRequest
