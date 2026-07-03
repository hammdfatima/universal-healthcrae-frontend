import { Check, X } from "lucide-react"

import { PASSWORD_REQUIREMENTS } from "@/lib/auth/password"
import { cn } from "@/lib/utils"

type PasswordRequirementsProps = {
  password: string
  className?: string
}

export default function PasswordRequirements({
  password,
  className,
}: PasswordRequirementsProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-muted/30 px-4 py-3",
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Password must include
      </p>
      <ul className="mt-2 space-y-1.5">
        {PASSWORD_REQUIREMENTS.map((requirement) => {
          const met = requirement.test(password)

          return (
            <li
              key={requirement.id}
              className={cn(
                "flex items-center gap-2 text-sm",
                met ? "text-primary" : "text-muted-foreground"
              )}
            >
              {met ? (
                <Check className="size-3.5 shrink-0" aria-hidden />
              ) : (
                <X className="size-3.5 shrink-0 opacity-60" aria-hidden />
              )}
              <span>{requirement.label}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
