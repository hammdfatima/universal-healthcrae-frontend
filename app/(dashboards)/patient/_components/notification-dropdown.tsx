"use client"

import {
  Activity,
  Bell,
  CheckCheck,
  FlaskConical,
  Settings,
  Stethoscope,
  Syringe,
} from "lucide-react"
import Link from "next/link"
import { type ComponentType, useEffect, useState } from "react"

import {
  getNotificationsFromStorage,
  getUnreadNotificationCount,
  type Notification,
  type NotificationType,
  saveNotificationsToStorage,
} from "@/app/(dashboards)/patient/_lib/notifications"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

const notificationIcons: Record<
  NotificationType,
  ComponentType<{ className?: string }>
> = {
  lab: FlaskConical,
  medication: Activity,
  vaccination: Syringe,
  provider: Stethoscope,
  system: Settings,
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    setNotifications(getNotificationsFromStorage())
  }, [])

  const unreadCount = getUnreadNotificationCount(notifications)

  function updateNotifications(next: Notification[]) {
    setNotifications(next)
    saveNotificationsToStorage(next)
  }

  function markAsRead(id: string) {
    updateNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  function markAllAsRead() {
    updateNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="relative size-10 rounded-full p-0"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          {unreadCount > 0 ? (
            <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[min(100vw-2rem,24rem)] gap-0 overflow-hidden p-0"
      >
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <Typography variant="small" className="font-semibold">
            Notifications
          </Typography>
          {unreadCount > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 text-xs text-primary"
              onClick={markAllAsRead}
            >
              <CheckCheck className="size-3.5" aria-hidden />
              Mark all read
            </Button>
          ) : null}
        </div>

        <div className="thin-scrollbar max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Typography variant="muted" className="text-sm">
                You&apos;re all caught up.
              </Typography>
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type]

                return (
                  <li key={notification.id}>
                    <NotificationItem
                      notification={notification}
                      icon={Icon}
                      onRead={() => markAsRead(notification.id)}
                      onNavigate={() => setOpen(false)}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function NotificationItem({
  notification,
  icon: Icon,
  onRead,
  onNavigate,
}: {
  notification: Notification
  icon: ComponentType<{ className?: string }>
  onRead: () => void
  onNavigate: () => void
}) {
  const content = (
    <>
      <span
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
          notification.read
            ? "bg-muted text-muted-foreground"
            : "bg-primary/10 text-primary"
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Typography
            variant="small"
            className={cn(
              "leading-snug",
              !notification.read && "font-semibold"
            )}
          >
            {notification.title}
          </Typography>
          {!notification.read ? (
            <span
              className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
              aria-hidden
            />
          ) : null}
        </div>
        <Typography variant="muted" className="mt-1 line-clamp-2 text-xs">
          {notification.message}
        </Typography>
        <Typography variant="muted" className="mt-1.5 text-[11px]">
          {notification.time}
        </Typography>
      </div>
    </>
  )

  const className = cn(
    "flex w-full gap-3 border-b border-border/40 px-4 py-3 text-left transition-colors last:border-b-0",
    notification.read ? "bg-background" : "bg-primary/5 hover:bg-primary/10",
    notification.href && "cursor-pointer hover:bg-muted/60"
  )

  if (notification.href) {
    return (
      <Link
        href={notification.href}
        className={className}
        onClick={() => {
          if (!notification.read) onRead()
          onNavigate()
        }}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (!notification.read) onRead()
      }}
    >
      {content}
    </button>
  )
}
