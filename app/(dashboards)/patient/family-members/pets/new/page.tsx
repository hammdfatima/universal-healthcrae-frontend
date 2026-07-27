"use client"

import type { Route } from "next"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LegacyNewPetPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/patient/pets/new" as Route)
  }, [router])

  return null
}
