import type { AdminUser } from "@/app/(dashboards)/admin/_lib/users"
import { getUserInitials } from "@/app/(dashboards)/admin/_lib/users"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type UserAvatarProps = {
  user: Pick<AdminUser, "name" | "profileImage">
  className?: string
  fallbackClassName?: string
}

export function UserAvatar({
  user,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  return (
    <Avatar className={cn("size-9 border border-border/60", className)}>
      {user.profileImage ? (
        <AvatarImage src={user.profileImage} alt={user.name} />
      ) : null}
      <AvatarFallback
        className={cn(
          "bg-primary/10 text-xs font-semibold text-primary",
          fallbackClassName
        )}
      >
        {getUserInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}
