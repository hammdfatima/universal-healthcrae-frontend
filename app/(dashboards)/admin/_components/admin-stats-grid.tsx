import { CreditCard, Tags, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

import { adminStats } from "@/app/(dashboards)/admin/_lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Total Users",
    value: adminStats.totalUsers.toLocaleString(),
    detail: "Registered accounts",
    href: "/admin/users",
    icon: Users,
    accent:
      "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20",
    iconBg: "bg-emerald-500/15 text-emerald-600",
  },
  {
    label: "Active Subscriptions",
    value: adminStats.activeSubscriptions.toLocaleString(),
    detail: "Paying members",
    href: "/admin/subscription-plans",
    icon: Tags,
    accent:
      "from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20",
    iconBg: "bg-blue-500/15 text-blue-600",
  },
  {
    label: "Monthly Revenue",
    value: adminStats.monthlyRevenue,
    detail: "Current billing cycle",
    href: "/admin/payments",
    icon: TrendingUp,
    accent:
      "from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20",
    iconBg: "bg-amber-500/15 text-amber-600",
  },
  {
    label: "Payments",
    value: String(adminStats.paymentsThisMonth),
    detail: "Processed this month",
    href: "/admin/payments",
    icon: CreditCard,
    accent:
      "from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20",
    iconBg: "bg-violet-500/15 text-violet-600",
  },
] as const

export default function AdminStatsGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(
        ({ label, value, detail, href, icon: Icon, accent, iconBg }) => (
          <li key={label}>
            <Link href={href} className="group block h-full">
              <Card className="h-full overflow-hidden border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                <CardContent
                  className={cn(
                    "relative flex items-center gap-4 bg-gradient-to-br p-5",
                    accent
                  )}
                >
                  <span
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105",
                      iconBg
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <Typography variant="muted" className="text-sm">
                      {label}
                    </Typography>
                    <Typography
                      as="p"
                      variant="h3"
                      className="mt-0.5 leading-tight"
                    >
                      {value}
                    </Typography>
                    <Typography variant="muted" className="text-xs">
                      {detail}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </li>
        )
      )}
    </ul>
  )
}
