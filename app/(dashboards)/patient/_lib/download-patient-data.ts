import axios from "axios"

import {
  PATIENT_SETTINGS_API,
  type PatientDataExport,
} from "@/lib/api/patient-settings"
import { getApiBaseUrl } from "@/lib/api-base"
import { buildRequestUrl } from "@/lib/utils"

/**
 * HIPAA §2.4: exporting the full health record requires a step-up token
 * obtained from POST /auth/step-up/verify (re-entered password).
 */
export async function downloadPatientDataExport(stepUpToken: string) {
  const response = await axios.get<{
    success: boolean
    message: string
    data: PatientDataExport
  }>(buildRequestUrl(getApiBaseUrl(), PATIENT_SETTINGS_API.exportData), {
    withCredentials: true,
    params: { stepUpToken },
  })

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
