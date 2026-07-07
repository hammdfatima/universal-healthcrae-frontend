import AllergiesOverviewCard from "@/app/(dashboards)/patient/_components/allergies-overview-card"
import CareTeamCard from "@/app/(dashboards)/patient/_components/care-team-card"
import DashboardWelcome from "@/app/(dashboards)/patient/_components/dashboard-welcome"
import HealthRecordsChart from "@/app/(dashboards)/patient/_components/health-records-chart"
import HealthStatsGrid from "@/app/(dashboards)/patient/_components/health-stats-grid"
import RecentMedicationsCard from "@/app/(dashboards)/patient/_components/recent-medications-card"
import VaccinationsCard from "@/app/(dashboards)/patient/_components/vaccinations-card"

export default function PatientDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-1 pb-4 sm:px-0">
      <DashboardWelcome />
      <HealthStatsGrid />

      <div className="grid items-stretch gap-6 xl:grid-cols-3">
        <div className="h-full xl:col-span-2">
          <HealthRecordsChart />
        </div>
        <div className="h-full">
          <CareTeamCard />
        </div>
      </div>

      <RecentMedicationsCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <AllergiesOverviewCard />
        <VaccinationsCard />
      </div>
    </div>
  )
}
