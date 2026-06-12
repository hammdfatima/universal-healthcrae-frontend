import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { Slot as SlotPrimitive } from "radix-ui"
import type * as React from "react"

import { cn } from "@/lib/utils"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl",
      h2: "text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
      h3: "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl",
      h4: "text-xl font-semibold tracking-tight text-foreground",
      h5: "text-lg font-semibold text-foreground",
      h6: "text-base font-semibold text-foreground",
      p: "text-base leading-relaxed",
      lead: "text-lg leading-relaxed sm:text-xl",
      large: "text-lg font-medium",
      small: "text-sm font-medium leading-none",
      muted: "text-sm leading-relaxed text-muted-foreground",
      span: "text-sm",
      label: "text-sm font-medium leading-none",
      button: "text-sm font-semibold leading-none",
    },
    color: {
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
      inherit: "text-inherit",
    },
  },
  defaultVariants: {
    variant: "p",
    color: "default",
  },
})

type TypographyElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "label"

const defaultElementMap: Record<
  NonNullable<VariantProps<typeof typographyVariants>["variant"]>,
  TypographyElement
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  lead: "p",
  large: "p",
  small: "span",
  muted: "p",
  span: "span",
  label: "label",
  button: "span",
}

export type TypographyProps = {
  as?: TypographyElement
  asChild?: boolean
} & Omit<React.HTMLAttributes<HTMLElement>, "color"> &
  VariantProps<typeof typographyVariants>

function Typography({
  as,
  asChild = false,
  className,
  variant = "p",
  color,
  ...props
}: TypographyProps) {
  const Component = asChild
    ? SlotPrimitive.Slot
    : as || defaultElementMap[variant ?? "p"]

  return (
    <Component
      className={cn(typographyVariants({ variant, color, className }))}
      {...props}
    />
  )
}

Typography.displayName = "Typography"

export { Typography, typographyVariants }
