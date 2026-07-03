import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const loaderVariants = cva("animate-spin", {
  variants: {
    variant: {
      button: "size-4",
      fetch: "size-5",
      "full-page": "size-10",
    },
    color: {
      primary: "text-primary",
      white: "text-white",
    },
  },
  defaultVariants: {
    variant: "fetch",
    color: "primary",
  },
})

type LoaderProps = ComponentProps<"div"> &
  VariantProps<typeof loaderVariants> & {
    label?: string
  }

function LoaderSpinner({
  variant,
  color,
  className,
}: VariantProps<typeof loaderVariants> & { className?: string }) {
  return (
    <Loader2
      aria-hidden
      className={cn(loaderVariants({ variant, color }), className)}
    />
  )
}

export function Loader({
  variant = "fetch",
  color = "primary",
  label,
  className,
  ...props
}: LoaderProps) {
  if (variant === "full-page") {
    return (
      // biome-ignore lint/a11y/useSemanticElements: output is not appropriate for full-page loading overlays
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={cn(
          "fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        <LoaderSpinner variant="full-page" color={color} />
        {label ? (
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
        ) : null}
        <span className="sr-only">{label ?? "Loading"}</span>
      </div>
    )
  }

  if (variant === "button") {
    return (
      // biome-ignore lint/a11y/useSemanticElements: output is not appropriate for inline button loaders
      <span
        role="status"
        aria-live="polite"
        className={cn("inline-flex", className)}
        {...props}
      >
        <LoaderSpinner variant="button" color={color} />
        <span className="sr-only">{label ?? "Loading"}</span>
      </span>
    )
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: output is not appropriate for centered fetch loaders
    <div
      role="status"
      aria-live="polite"
      className={cn("flex w-full items-center justify-center py-6", className)}
      {...props}
    >
      <LoaderSpinner variant="fetch" color={color} />
      {label ? (
        <p className="ml-2 text-sm text-muted-foreground">{label}</p>
      ) : null}
      <span className="sr-only">{label ?? "Loading"}</span>
    </div>
  )
}

export { loaderVariants, LoaderSpinner }
