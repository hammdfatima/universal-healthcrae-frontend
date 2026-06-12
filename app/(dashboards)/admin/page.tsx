import AdminStatsGrid from "@/app/(dashboards)/admin/_components/admin-stats-grid"
import PaymentsChart from "@/app/(dashboards)/admin/_components/payments-chart"
import RecentUsersCard from "@/app/(dashboards)/admin/_components/recent-users-card"
import { Typography } from "@/components/ui/typography"

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-1 pb-4 sm:px-0">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary to-primary px-6 py-8 text-secondary-foreground shadow-lg sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-white/10 blur-2xl" />
        <Typography
          as="h1"
          variant="h3"
          color="inherit"
          className="text-secondary-foreground"
        >
          Admin Dashboard
        </Typography>
        <Typography
          variant="muted"
          color="inherit"
          className="mt-2 max-w-xl text-secondary-foreground/80"
        >
          Manage users, subscription plans, payments, and platform settings from
          one place.
        </Typography>
      </section>

      <AdminStatsGrid />

      <PaymentsChart />
      <RecentUsersCard />
    </div>
  )
}
