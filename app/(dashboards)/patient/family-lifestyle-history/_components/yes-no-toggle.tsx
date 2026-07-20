"use client"

import { cn } from "@/lib/utils"

type YesNoToggleProps = {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  ariaLabel: string
}

export default function YesNoToggle({
  value,
  onChange,
  disabled = false,
  ariaLabel,
}: YesNoToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!value)}
      className={cn(
        "relative inline-flex h-8 min-w-[72px] items-center rounded-full border px-1 transition-colors",
        value ? "border-primary bg-primary/10" : "border-border bg-muted/60",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <span
        className={cn(
          "absolute inset-y-1 w-[calc(50%-2px)] rounded-full bg-background shadow-sm transition-transform",
          value ? "translate-x-[calc(100%+2px)]" : "translate-x-0"
        )}
      />
      <span
        className={cn(
          "relative z-10 flex-1 text-center text-[10px] font-semibold uppercase tracking-wide",
          !value ? "text-foreground" : "text-muted-foreground"
        )}
      >
        No
      </span>
      <span
        className={cn(
          "relative z-10 flex-1 text-center text-[10px] font-semibold uppercase tracking-wide",
          value ? "text-primary" : "text-muted-foreground"
        )}
      >
        Yes
      </span>
    </button>
  )
}
