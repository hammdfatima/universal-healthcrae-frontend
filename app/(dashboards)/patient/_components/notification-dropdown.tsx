"use client"

import { useQueryClient } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import {
  Activity,
  Bell,
  CheckCheck,
  FlaskConical,
  LogIn,
  ScanLine,
  Settings,
  Stethoscope,
  Syringe,
} from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { type ComponentType, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  type AppNotification,
  NOTIFICATIONS_API,
  NOTIFICATIONS_QUERY_KEYS,
  type NotificationsListResponse,
  type NotificationType,
  notificationsListPath,
} from "@/lib/api/notifications"
import { cn } from "@/lib/utils"

const notificationIcons: Record<
  NotificationType,
  ComponentType<{ className?: string }>
> = {
  lab: FlaskConical,
  medication: Activity,
  vaccination: Syringe,
  imaging: ScanLine,
  provider: Stethoscope,
  system: Settings,
}

export default function NotificationDropdown() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data, isLoading, refetch } = useFetch<NotificationsListResponse>({
    path: notificationsListPath(),
    queryKey: NOTIFICATIONS_QUERY_KEYS.list,
    refetchInterval: 60_000,
  })

  useEffect(() => {
    if (open) {
      void refetch()
    }
  }, [open, refetch])

  const { onRequest: markRead } = useApi<Record<string, never>>({
    key: "mark-notification-read",
    method: "patch",
  })

  const { onRequest: markAllRead, isPending: isMarkingAllRead } = useApi<
    Record<string, never>
  >({
    key: "mark-all-notifications-read",
    method: "patch",
  })

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0

  function invalidateNotifications() {
    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.list })
  }

  function handleMarkAsRead(id: string) {
    markRead({
      path: NOTIFICATIONS_API.markRead(id),
      data: {},
      onSuccess: () => invalidateNotifications(),
    })
  }

  function handleMarkAllAsRead() {
    markAllRead({
      path: NOTIFICATIONS_API.markAllRead,
      data: {},
      onSuccess: () => invalidateNotifications(),
    })
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
              disabled={isMarkingAllRead}
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="size-3.5" aria-hidden />
              Mark all read
            </Button>
          ) : null}
        </div>

        <div className="thin-scrollbar max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader label="Loading notifications..." />
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Typography variant="muted" className="text-sm">
                You&apos;re all caught up.
              </Typography>
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => {
                const Icon =
                  notification.type === "system" &&
                  notification.title === "New sign-in"
                    ? LogIn
                    : notificationIcons[notification.type]

                return (
                  <li key={notification.id}>
                    <NotificationItem
                      notification={notification}
                      icon={Icon}
                      onRead={() => handleMarkAsRead(notification.id)}
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
  notification: AppNotification
  icon: ComponentType<{ className?: string }>
  onRead: () => void
  onNavigate: () => void
}) {
  const timeLabel = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  })

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
          {timeLabel}
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
        href={notification.href as Route}
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
