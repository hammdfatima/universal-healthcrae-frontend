"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import axios from "axios"
import type React from "react"
import { useState } from "react"

import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/provider/auth-provider"

const MAX_RETRIES = 2

const HTTP_STATUS_TO_NOT_RETRY = [400, 401, 403, 404]
export default function Provider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry(failureCount, error) {
              console.error("Query failed, retrying...", error)

              if (failureCount > MAX_RETRIES) {
                return false
              }

              if (axios.isAxiosError(error)) {
                const status = error.response?.status
                if (status && HTTP_STATUS_TO_NOT_RETRY.includes(status)) {
                  console.log("Aborting retry due to status:", status)
                  return false
                }
              }

              return true
            },
          },
        },
      })
  )
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        {children}
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  )
}
