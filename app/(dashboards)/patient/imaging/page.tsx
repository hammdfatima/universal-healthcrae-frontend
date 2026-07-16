import { redirect } from "next/navigation"

import { healthRecordHref } from "@/app/(dashboards)/patient/_lib/health-record-tabs"

export default function ImagingPage() {
  redirect(healthRecordHref("imaging"))
}
