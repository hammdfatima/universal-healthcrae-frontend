"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  formValuesToPayload,
  getUploadErrorMessage,
  type ImagingResultFormValues,
  resolveImagingResultFile,
} from "@/app/(dashboards)/patient/_lib/imaging"
import ImagingResultForm from "@/app/(dashboards)/patient/imaging/_components/imaging-result-form"
import useApi from "@/hooks/use-api"
import useToast from "@/hooks/use-toast"
import {
  type CreateImagingResultPayload,
  IMAGING_RESULTS_API,
  IMAGING_RESULTS_QUERY_KEYS,
} from "@/lib/api/imaging-results"

export default function NewImagingPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toastError } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const { onRequest: createImagingResult, isPending } =
    useApi<CreateImagingResultPayload>({
      key: "create-imaging-result",
      method: "post",
    })

  async function handleSubmit(
    values: ImagingResultFormValues,
    selectedFile: File | null
  ) {
    try {
      setIsUploading(true)
      const file = await resolveImagingResultFile(values, selectedFile)
      setIsUploading(false)

      createImagingResult({
        path: IMAGING_RESULTS_API.create,
        data: formValuesToPayload(values, file),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: IMAGING_RESULTS_QUERY_KEYS.list,
          })
          router.push("/patient/imaging")
        },
      })
    } catch (error) {
      setIsUploading(false)
      toastError(getUploadErrorMessage(error))
    }
  }

  return (
    <ImagingResultForm
      title="Add Imaging"
      description="Upload a scan with file name, test type, scan type, and scan date."
      submitLabel="Save"
      isSubmitting={isPending || isUploading}
      onSubmit={handleSubmit}
    />
  )
}
