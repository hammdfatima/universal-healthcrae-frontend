"use client"

import type { Route } from "next"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LegacyEditPetPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      router.replace(`/patient/pets/${params.id}/edit` as Route)
    }
  }, [params.id, router])

  return null
}
