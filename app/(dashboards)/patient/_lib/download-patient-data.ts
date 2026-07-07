import axios from "axios"

import { env } from "@/env"
import {
  PATIENT_SETTINGS_API,
  type PatientDataExport,
} from "@/lib/api/patient-settings"
import { getAuthToken } from "@/lib/auth/session"
import { buildRequestUrl } from "@/lib/utils"

export async function downloadPatientDataExport() {
  const token = getAuthToken()

  const response = await axios.get<{
    success: boolean
    message: string
    data: PatientDataExport
  }>(
    buildRequestUrl(env.NEXT_PUBLIC_API_URL, PATIENT_SETTINGS_API.exportData),
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  )

  const exportData = response.data.data
  const fileName = `uhc-data-export-${exportData.exportedAt.slice(0, 10)}.json`
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
