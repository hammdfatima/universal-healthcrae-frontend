"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"
import {
  formValuesToPayload,
  getUploadErrorMessage,
  type ImagingResultFormValues,
  imagingResultToFormValues,
  resolveImagingResultFile,
} from "@/app/(dashboards)/patient/_lib/imaging"
import ImagingResultForm from "@/app/(dashboards)/patient/imaging/_components/imaging-result-form"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import useToast from "@/hooks/use-toast"
import {
  IMAGING_RESULTS_API,
  IMAGING_RESULTS_QUERY_KEYS,
  type ImagingResultsListResponse,
  type UpdateImagingResultPayload,
} from "@/lib/api/imaging-results"

export default function EditImagingPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toastError } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const { data, isLoading } = useFetch<ImagingResultsListResponse>({
    path: IMAGING_RESULTS_API.list,
    queryKey: IMAGING_RESULTS_QUERY_KEYS.list,
  })

  const result = useMemo(
    () => data?.imagingResults.find((item) => item.id === params.id) ?? null,
    [data?.imagingResults, params.id]
  )

  const { onRequest: updateImagingResult, isPending } =
    useApi<UpdateImagingResultPayload>({
      key: "update-imaging-result",
      method: "patch",
    })

  async function handleSubmit(
    values: ImagingResultFormValues,
    selectedFile: File | null
  ) {
    if (!result) return

    try {
      setIsUploading(true)
      const file = await resolveImagingResultFile(values, selectedFile)
      setIsUploading(false)

      updateImagingResult({
        path: IMAGING_RESULTS_API.update(result.id),
        data: formValuesToPayload(values, file),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: IMAGING_RESULTS_QUERY_KEYS.list,
          })
          router.push(healthRecordHref("imaging"))
        },
      })
    } catch (error) {
      setIsUploading(false)
      toastError(getUploadErrorMessage(error))
    }
  }

  if (isLoading) {
    return <Loader variant="full-page" label="Loading imaging record..." />
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Typography variant="h4">Imaging record not found</Typography>
        <Typography variant="muted" className="mt-2">
          This record may have been removed or the link is invalid.
        </Typography>
      </div>
    )
  }

  return (
    <ImagingResultForm
      key={result.id}
      title="Edit Imaging"
      description={`Update details for ${result.fileName}.`}
      defaultValues={imagingResultToFormValues(result)}
      submitLabel="Save Changes"
      isSubmitting={isPending || isUploading}
      onSubmit={handleSubmit}
    />
  )
}
