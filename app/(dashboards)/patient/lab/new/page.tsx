"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import {
  formValuesToPayload,
  getUploadErrorMessage,
  type LabResultFormValues,
  resolveLabResultFile,
} from "@/app/(dashboards)/patient/_lib/lab"
import LabResultForm from "@/app/(dashboards)/patient/lab/_components/lab-result-form"
import useApi from "@/hooks/use-api"
import useToast from "@/hooks/use-toast"
import {
  type CreateLabResultPayload,
  LAB_RESULTS_API,
  LAB_RESULTS_QUERY_KEYS,
} from "@/lib/api/lab-results"

export default function NewLabResultPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toastError } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const { onRequest: createLabResult, isPending } =
    useApi<CreateLabResultPayload>({
      key: "create-lab-result",
      method: "post",
    })

  async function handleSubmit(
    values: LabResultFormValues,
    selectedFile: File | null
  ) {
    try {
      setIsUploading(true)
      const file = await resolveLabResultFile(values, selectedFile)
      setIsUploading(false)

      createLabResult({
        path: LAB_RESULTS_API.create,
        data: formValuesToPayload(values, file),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: LAB_RESULTS_QUERY_KEYS.list,
          })
          router.push(healthRecordHref("laboratory"))
        },
      })
    } catch (error) {
      setIsUploading(false)
      toastError(getUploadErrorMessage(error))
    }
  }

  return (
    <LabResultForm
      title="Add Lab Result"
      description="Upload a lab report with file name, test type, and test date."
      submitLabel="Save"
      isSubmitting={isPending || isUploading}
      onSubmit={handleSubmit}
    />
  )
}
