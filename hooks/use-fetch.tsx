/** biome-ignore-all lint/suspicious/noExplicitAny: error type is any */
"use client"
import type { UseQueryOptions } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { env } from "@/env"
import { getAuthToken } from "@/lib/auth/session"
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

export function useFetch<T>({ path, queryKey, ...config }: IUseFetch<T>) {
  const token = getAuthToken()
  if (!queryKey) {
    throw new Error("queryKey is required")
  }
  if (!path) {
    throw new Error("path is required")
  }
  const REQUEST_URL = buildRequestUrl(env.NEXT_PUBLIC_API_URL, path)

  const fetchData = async (): Promise<T> => {
    try {
      const response = await axios.get(REQUEST_URL, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      })
      if (response.data.data) {
        return response.data.data
      }
      return response.data
    } catch (error: any) {
      if (!error.response) {
        throw new Error("Network error, please check your internet connection.")
      }
      const message = error.response.data?.message as string | undefined
      const status = error.response.status
      const shouldEndSession =
        getAuthToken() &&
        (status === 401 ||
          (status === 403 && message?.toLowerCase().includes("blocked")))

      if (shouldEndSession) {
        handleSessionEnd(
          status === 403 && message?.toLowerCase().includes("blocked")
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
