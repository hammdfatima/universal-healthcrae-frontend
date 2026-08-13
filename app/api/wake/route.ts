import { NextResponse } from "next/server"

import { pingBackendHealth } from "@/lib/wake-backend"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

/**
 * Starts a Render free-tier spin-up of the API and reports when it can
 * accept traffic. Visiting the frontend alone does not wake the backend.
 */
export async function GET() {
  const ready = await pingBackendHealth(50_000)
  return NextResponse.json({ ready, waking: !ready })
}
