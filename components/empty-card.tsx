import type { LucideIcon } from "lucide-react"
import { InboxIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type EmptyCardProps = {
  title?: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
  className?: string
}

export default function EmptyCard({
  title = "No data available",
  description,
  icon: Icon = InboxIcon,
  action,
  className,
}: EmptyCardProps) {
  return (
    <Card className={cn("w-full border-dashed shadow-none", className)}>
      <CardContent className="flex h-full flex-col items-center justify-center px-4 py-10 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
          <Icon className="size-7 text-muted-foreground" aria-hidden />
        </div>
        <p className="text-base font-medium text-foreground">{title}</p>
        {description ? (
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </CardContent>
    </Card>
  )
}
