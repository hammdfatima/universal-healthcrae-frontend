"use client"

import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useEffect } from "react"
import toast from "react-hot-toast"

import {
  formatDoseTimeLabel,
  getMedicationDosesDueNow,
  getUpcomingMedicationDoses,
} from "@/app/(dashboards)/patient/_lib/medications"
import { env } from "@/env"
import { useFetch } from "@/hooks/use-fetch"
import {
  MEDICATIONS_API,
  MEDICATIONS_QUERY_KEYS,
  type MedicationsListResponse,
} from "@/lib/api/medications"
import {
  NOTIFICATIONS_QUERY_KEYS,
  type NotificationsListResponse,
  notificationsListPath,
} from "@/lib/api/notifications"
import { buildRequestUrl } from "@/lib/utils"

const FIRED_KEY_PREFIX = "uhc:med-dose-fired:"

function doseStorageKey(medicationId: string, time: string, fireAt: Date) {
  const day = `${fireAt.getFullYear()}${String(fireAt.getMonth() + 1).padStart(2, "0")}${String(fireAt.getDate()).padStart(2, "0")}`
  return `${FIRED_KEY_PREFIX}${medicationId}:${day}:${time}`
}

function hasFired(key: string) {
  try {
    return sessionStorage.getItem(key) === "1"
  } catch {
    return false
  }
}

function markFired(key: string) {
  try {
    sessionStorage.setItem(key, "1")
  } catch {
    // ignore storage failures
  }
}

async function ensureBrowserPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission === "denied") {
    return false
  }

  const result = await Notification.requestPermission()
  return result === "granted"
}

/**
 * Schedules in-app + browser reminders for each remaining dose today,
 * firing at the exact local dose time while the patient dashboard is open.
 */
export function useMedicationDoseReminders(enabled = true) {
  const queryClient = useQueryClient()

  const { data } = useFetch<MedicationsListResponse>({
    path: MEDICATIONS_API.list,
    queryKey: MEDICATIONS_QUERY_KEYS.list,
    enabled,
    refetchInterval: 5 * 60_000,
  })

  useEffect(() => {
    if (!enabled) return

    void ensureBrowserPermission()
  }, [enabled])

  useEffect(() => {
    if (!enabled || !data?.medications) return

    const timers: number[] = []
    const medications = data.medications

    async function fireDose(params: {
      medicationId: string
      medicineName: string
      dosage: string
      time: string
      fireAt: Date
    }) {
      const key = doseStorageKey(
        params.medicationId,
        params.time,
        params.fireAt
      )
      if (hasFired(key)) return
      markFired(key)

      const label = formatDoseTimeLabel(params.time)
      const title = `Time for your ${label} dose`
      const message = `It's ${label} — take ${params.medicineName} (${params.dosage}).`

      toast.success(message, {
        duration: 10_000,
        position: "top-right",
      })

      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          try {
            new Notification(title, {
              body: message,
              tag: key,
            })
          } catch {
            // Some browsers block Notification constructors without a service worker.
          }
        }
      }

      try {
        const response = await axios.get(
          buildRequestUrl(env.NEXT_PUBLIC_API_URL, notificationsListPath()),
          { withCredentials: true }
        )
        const payload = (response.data?.data ??
          response.data) as NotificationsListResponse
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEYS.list, payload)
      } catch {
        void queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEYS.list,
        })
      }
    }

    function scheduleDoses() {
      for (const timer of timers) {
        window.clearTimeout(timer)
        window.clearInterval(timer)
      }
      timers.length = 0

      const now = new Date()
      const upcoming = getUpcomingMedicationDoses(medications, now)

      for (const dose of upcoming) {
        const key = doseStorageKey(dose.medication.id, dose.time, dose.fireAt)
        if (hasFired(key)) continue

        const delay = dose.fireAt.getTime() - Date.now()
        if (delay <= 0) {
          void fireDose({
            medicationId: dose.medication.id,
            medicineName: dose.medication.medicineName,
            dosage: dose.medication.dosage,
            time: dose.time,
            fireAt: dose.fireAt,
          })
          continue
        }

        const timerId = window.setTimeout(() => {
          void fireDose({
            medicationId: dose.medication.id,
            medicineName: dose.medication.medicineName,
            dosage: dose.medication.dosage,
            time: dose.time,
            fireAt: dose.fireAt,
          })
        }, delay)

        timers.push(timerId)
      }

      // Reschedule overnight so tomorrow's doses get timers without a refresh.
      const nextMidnight = new Date(now)
      nextMidnight.setHours(24, 0, 5, 0)
      timers.push(
        window.setTimeout(() => {
          scheduleDoses()
        }, nextMidnight.getTime() - now.getTime())
      )

      // Safety tick near the clock boundary (covers sleeps / background tabs).
      timers.push(
        window.setInterval(() => {
          const dueNow = getMedicationDosesDueNow(medications, new Date())
          for (const dose of dueNow) {
            void fireDose({
              medicationId: dose.medication.id,
              medicineName: dose.medication.medicineName,
              dosage: dose.medication.dosage,
              time: dose.time,
              fireAt: dose.fireAt,
            })
          }
        }, 10_000)
      )
    }

    scheduleDoses()

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer)
        window.clearInterval(timer)
      }
    }
  }, [data?.medications, enabled, queryClient])
}
