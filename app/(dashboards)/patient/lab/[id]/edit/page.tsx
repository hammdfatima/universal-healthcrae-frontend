"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import {
  formValuesToPayload,
  getUploadErrorMessage,
  type LabResultFormValues,
  labResultToFormValues,
  resolveLabResultFile,
} from "@/app/(dashboards)/patient/_lib/lab"
import LabResultForm from "@/app/(dashboards)/patient/lab/_components/lab-result-form"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import useToast from "@/hooks/use-toast"
import {
  LAB_RESULTS_API,
  LAB_RESULTS_QUERY_KEYS,
  type LabResultsListResponse,
  type UpdateLabResultPayload,
} from "@/lib/api/lab-results"

export default function EditLabResultPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toastError } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const { data, isLoading } = useFetch<LabResultsListResponse>({
    path: LAB_RESULTS_API.list,
    queryKey: LAB_RESULTS_QUERY_KEYS.list,
  })

  const result = useMemo(
    () => data?.labResults.find((item) => item.id === params.id) ?? null,
    [data?.labResults, params.id]
  )

  const { onRequest: updateLabResult, isPending } =
    useApi<UpdateLabResultPayload>({
      key: "update-lab-result",
      method: "patch",
    })

  async function handleSubmit(
    values: LabResultFormValues,
    selectedFile: File | null
  ) {
    if (!result) return

    try {
      setIsUploading(true)
      const file = await resolveLabResultFile(values, selectedFile)
      setIsUploading(false)

      updateLabResult({
        path: LAB_RESULTS_API.update(result.id),
        data: formValuesToPayload(values, file),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: LAB_RESULTS_QUERY_KEYS.list,
          })
          router.push("/patient/lab")
        },
      })
    } catch (error) {
      setIsUploading(false)
      toastError(getUploadErrorMessage(error))
    }
  }

  if (isLoading) {
    return <Loader variant="full-page" label="Loading lab result..." />
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Lab result not found</Typography>
        <Typography variant="muted" className="mt-2">
          This record may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <LabResultForm
      key={result.id}
      title="Edit Lab Result"
      description={`Update details for ${result.fileName}.`}
      defaultValues={labResultToFormValues(result)}
      submitLabel="Save Changes"
      isSubmitting={isPending || isUploading}
      onSubmit={handleSubmit}
    />
  )
}
