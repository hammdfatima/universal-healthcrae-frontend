import type { Route } from "next"

export type NotificationType =
  | "lab"
  | "medication"
  | "vaccination"
  | "provider"
  | "system"

export type Notification = {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
  href?: Route
}

export const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "lab",
    title: "Lab results available",
    message: "Your CBC panel from Jun 8 is ready to review.",
    time: "2 hours ago",
    read: false,
    href: "/patient/lab",
  },
  {
    id: "2",
    type: "medication",
    title: "Medication reminder",
    message: "Time to take Metformin 500 mg with breakfast.",
    time: "5 hours ago",
    read: false,
    href: "/patient/medications",
  },
  {
    id: "3",
    type: "vaccination",
    title: "Vaccination due soon",
    message: "Your annual flu shot is due within the next 30 days.",
    time: "Yesterday",
    read: false,
    href: "/patient/vaccinations",
  },
  {
    id: "4",
    type: "provider",
    title: "Care provider update",
    message: "Dr. Brooklyn Belle shared updated clinic hours.",
    time: "2 days ago",
    read: true,
    href: "/patient/provider",
  },
  {
    id: "5",
    type: "system",
    title: "Profile incomplete",
    message: "Add your blood group and emergency details in settings.",
    time: "3 days ago",
    read: true,
    href: "/patient/settings",
  },
]

export const NOTIFICATIONS_STORAGE_KEY = "uhc-patient-notifications"

export function getNotificationsFromStorage(): Notification[] {
  if (typeof window === "undefined") return initialNotifications

  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    if (!stored) return initialNotifications
    return JSON.parse(stored) as Notification[]
  } catch {
    return initialNotifications
  }
}

export function saveNotificationsToStorage(notifications: Notification[]) {
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
}

export function getUnreadNotificationCount(notifications: Notification[]): number {
  return notifications.filter((notification) => !notification.read).length
}
