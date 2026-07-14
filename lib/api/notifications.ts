export type NotificationType =
  | "medication"
  | "vaccination"
  | "lab"
  | "imaging"
  | "provider"
  | "system"

export type AppNotification = {
  id: string
  type: NotificationType
  title: string
  message: string
  href: string | null
  read: boolean
  createdAt: string
}

export type NotificationsListResponse = {
  notifications: AppNotification[]
  unreadCount: number
}

export const NOTIFICATIONS_API = {
  list: "/notifications",
  markRead: (id: string) => `/notifications/${id}/read`,
  markAllRead: "/notifications/read-all",
} as const

export function notificationsListPath(
  timezoneOffset = new Date().getTimezoneOffset()
) {
  return `${NOTIFICATIONS_API.list}?timezoneOffset=${timezoneOffset}`
}

export const NOTIFICATIONS_QUERY_KEYS = {
  list: ["notifications", "list"] as const,
}
