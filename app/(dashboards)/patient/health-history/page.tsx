import { redirect } from "next/navigation"

import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"

export default function HealthHistoryPage() {
  redirect(healthRecordHref("health-history"))
}
