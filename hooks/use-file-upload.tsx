"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { env } from "@/env"
import useToast from "@/hooks/use-toast"
import {
  type CloudinaryResourceType,
  FILES_API,
  FILES_QUERY_KEYS,
  type UploadedFile,
} from "@/lib/api/files"
import { buildRequestUrl } from "@/lib/utils"

type ApiResponse<T> = {
  message: string
  data: T
}

type UploadFileOptions = {
  onSuccess?: (file: UploadedFile) => void
  onError?: (error: unknown) => void
}

type DeleteFileOptions = {
  publicId: string
  resourceType?: CloudinaryResourceType
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useFileUpload() {
  const queryClient = useQueryClient()
  const { toastError, toastSuccess } = useToast()

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)

      const response = await axios.post<ApiResponse<UploadedFile>>(
        buildRequestUrl(env.NEXT_PUBLIC_API_URL, FILES_API.upload),
        formData,
        {
          withCredentials: true,
        }
      )

      return response.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async ({
      publicId,
      resourceType,
    }: {
      publicId: string
      resourceType?: CloudinaryResourceType
    }) => {
      const response = await axios.delete<ApiResponse<{ message: string }>>(
        buildRequestUrl(env.NEXT_PUBLIC_API_URL, FILES_API.delete),
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: { publicId, resourceType },
          withCredentials: true,
        }
      )

      return response.data
    },
  })

  function uploadFile(file: File, options: UploadFileOptions = {}) {
    uploadMutation.mutate(file, {
      onSuccess: (response) => {
        toastSuccess(response.message)
        queryClient.invalidateQueries({ queryKey: FILES_QUERY_KEYS.list })
        options.onSuccess?.(response.data)
      },
      onError: (error) => {
        const message = axios.isAxiosError(error)
          ? (error.response?.data?.message as string | undefined)
          : undefined
        toastError(message ?? "Failed to upload file.")
        options.onError?.(error)
      },
    })
  }

  function deleteFile({
    publicId,
    resourceType,
    onSuccess,
    onError,
  }: DeleteFileOptions) {
    deleteMutation.mutate(
      { publicId, resourceType },
      {
        onSuccess: (response) => {
          toastSuccess(response.message)
          queryClient.invalidateQueries({ queryKey: FILES_QUERY_KEYS.list })
          onSuccess?.()
        },
        onError: (error) => {
          const message = axios.isAxiosError(error)
            ? (error.response?.data?.message as string | undefined)
            : undefined
          toastError(message ?? "Failed to delete file.")
          onError?.(error)
        },
      }
    )
  }

  return {
    uploadFile,
    deleteFile,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isPending: uploadMutation.isPending || deleteMutation.isPending,
  }
}
