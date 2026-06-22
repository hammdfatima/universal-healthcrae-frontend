import type { Route } from "next"

export type AdminNotificationType = "user" | "payment" | "plan" | "system"

export type AdminNotification = {
  id: string
  type: AdminNotificationType
  title: string
  message: string
  time: string
  read: boolean
  href?: Route
}

export const initialAdminNotifications: AdminNotification[] = [
  {
    id: "1",
    type: "user",
    title: "New user registration",
    message: "Sarah Johnson created a new patient account.",
    time: "1 hour ago",
    read: false,
    href: "/admin/users" as Route,
  },
  {
    id: "2",
    type: "payment",
    title: "Payment received",
    message: "John Smith paid $9.95 for Individual Plan.",
    time: "3 hours ago",
    read: false,
    href: "/admin/payments" as Route,
  },
  {
    id: "3",
    type: "payment",
    title: "Payment failed",
    message: "Emily Davis subscription payment could not be processed.",
    time: "Yesterday",
    read: false,
    href: "/admin/payments" as Route,
  },
  {
    id: "4",
    type: "plan",
    title: "Plan update",
    message: "Family Plan pricing was updated to $29.95/month.",
    time: "2 days ago",
    read: true,
    href: "/admin/subscription-plans" as Route,
  },
  {
    id: "5",
    type: "system",
    title: "Weekly platform summary",
    message: "976 active subscriptions and 342 payments this month.",
    time: "3 days ago",
    read: true,
    href: "/admin" as Route,
  },
]

export const ADMIN_NOTIFICATIONS_STORAGE_KEY = "uhc-admin-notifications"

export function getAdminNotificationsFromStorage(): AdminNotification[] {
  if (typeof window === "undefined") return initialAdminNotifications

  try {
    const stored = localStorage.getItem(ADMIN_NOTIFICATIONS_STORAGE_KEY)
    if (!stored) return initialAdminNotifications
    return JSON.parse(stored) as AdminNotification[]
  } catch {
    return initialAdminNotifications
  }
}

export function saveAdminNotificationsToStorage(
  notifications: AdminNotification[]
) {
  localStorage.setItem(
    ADMIN_NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(notifications)
  )
}

export function getUnreadAdminNotificationCount(
  notifications: AdminNotification[]
): number {
  return notifications.filter((notification) => !notification.read).length
}
