import type { UserRole } from "@/lib/auth/types"

type JwtPayload = {
  user_id: string
  email: string
  role: UserRole
  exp?: number
  iat?: number
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "="
  )

  return atob(padded)
}

export function decodeAccessToken(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".")
    if (!payload) {
      return null
    }

    return JSON.parse(decodeBase64Url(payload)) as JwtPayload
  } catch {
    return null
  }
}

export function isAccessTokenExpired(token: string) {
  const payload = decodeAccessToken(token)
  if (!payload?.exp) {
    return true
  }

  return payload.exp * 1000 <= Date.now()
}
