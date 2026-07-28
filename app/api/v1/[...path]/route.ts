import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

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

function getBackendBaseUrl() {
  const backendApiUrl = process.env.BACKEND_API_URL?.trim()
  if (backendApiUrl) {
    return backendApiUrl.replace(/\/+$/, "")
  }

  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (publicApiUrl && /^https?:\/\//i.test(publicApiUrl)) {
    return publicApiUrl.replace(/\/+$/, "")
  }

  return "http://localhost:8080/api/v1"
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

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  const targetUrl = `${getBackendBaseUrl()}/${path.join("/")}${request.nextUrl.search}`

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
    upstream = await fetch(targetUrl, init)
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to reach the API server. Please try again.",
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
