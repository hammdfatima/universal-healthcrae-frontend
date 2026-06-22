import type { ReactNode } from "react"

import { Typography } from "@/components/ui/typography"

type LegalPageLayoutProps = {
  title: string
  description: string
  lastUpdated: string
  children: ReactNode
}

export default function LegalPageLayout({
  title,
  description,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <>
      <section className="border-b border-border/70 bg-brand-primary-light/40 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Typography as="h1" variant="h1">
            {title}
          </Typography>
          <Typography variant="lead" color="muted" className="mt-4">
            {description}
          </Typography>
          <Typography variant="muted" className="mt-3 text-sm">
            Last updated: {lastUpdated}
          </Typography>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <article className="prose-legal mx-auto max-w-3xl space-y-10">
          {children}
        </article>
      </section>
    </>
  )
}

type LegalSectionProps = {
  title: string
  children: ReactNode
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section>
      <Typography
        as="h2"
        variant="h3"
        className="border-b border-border/60 pb-3"
      >
        {title}
      </Typography>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  return (
    <Typography variant="p" color="muted" className="leading-relaxed">
      {children}
    </Typography>
  )
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>
          <Typography variant="p" color="muted" className="leading-relaxed">
            {item}
          </Typography>
        </li>
      ))}
    </ul>
  )
}

export function LegalCallout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-brand-primary-light/40 px-5 py-4">
      <Typography variant="p" className="leading-relaxed font-medium">
        {children}
      </Typography>
    </div>
  )
}
