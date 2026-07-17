/** biome-ignore-all lint/suspicious/noExplicitAny: error type is any */
"use client"
import type { UseQueryOptions } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { env } from "@/env"
import { getAuthUser } from "@/lib/auth/session"
import { handleSessionEnd } from "@/lib/auth/unauthorized"
import { buildRequestUrl } from "@/lib/utils"

export type FetchApiType = {
  queryKey: string[]
  path: string
}

type IUseFetch<T> = {
  path: string
  queryKey: readonly unknown[]
} & Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">

function isRequestCanceled(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false
  }

  if (axios.isCancel(error)) {
    return true
  }

  const err = error as { code?: string; name?: string; message?: string }
  return (
    err.code === "ERR_CANCELED" ||
    err.name === "CanceledError" ||
    err.name === "AbortError" ||
    err.message?.toLowerCase().includes("canceled") === true
  )
}

export function useFetch<T>({ path, queryKey, ...config }: IUseFetch<T>) {
  if (!queryKey) {
    throw new Error("queryKey is required")
  }
  if (!path) {
    throw new Error("path is required")
  }
  const REQUEST_URL = buildRequestUrl(env.NEXT_PUBLIC_API_URL, path)

  const fetchData = async ({
    signal,
  }: {
    signal?: AbortSignal
  }): Promise<T> => {
    try {
      const response = await axios.get(REQUEST_URL, {
        withCredentials: true,
        signal,
      })
      if (response.data.data) {
        return response.data.data
      }
      return response.data
    } catch (error: any) {
      // Let React Query treat cancellations as non-errors (unmount / key change).
      if (isRequestCanceled(error)) {
        throw error
      }

      if (!error.response) {
        throw new Error("Network error, please check your internet connection.")
      }
      const message = error.response.data?.message as string | undefined
      const status = error.response.status
      const isPublicEmergency = path.includes("/emergency-access/public/")
      const normalizedMessage = message?.toLowerCase() ?? ""
      // Cookie session is invalid — clear local user. Skip guests and public emergency unlock.
      const shouldEndSession =
        !isPublicEmergency &&
        Boolean(getAuthUser()) &&
        (status === 401 ||
          (status === 403 &&
            (normalizedMessage.includes("blocked") ||
              normalizedMessage.includes(
                "canceled or changed the subscription"
              ))))

      if (shouldEndSession) {
        handleSessionEnd(
          status === 403 &&
            normalizedMessage.includes("canceled or changed the subscription")
            ? "family_access"
            : status === 403 && normalizedMessage.includes("blocked")
              ? "blocked"
              : "revoked"
        )
      }
      throw error
    }
  }

  const query = useQuery<T, Error>({
    queryKey,
    queryFn: fetchData,
    refetchOnWindowFocus: false,
    ...config,
  })

  return query
}
