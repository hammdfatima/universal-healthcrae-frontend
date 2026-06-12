import type { Metadata } from "next"

import OnboardingPatientContent from "@/app/onboarding/patient/_components/onboarding-patient-content"

export const metadata: Metadata = {
  title: "Complete Your Profile",
  description: "Set up your Universal Health Charts patient profile.",
}

export default function OnboardingPatientPage() {
  return <OnboardingPatientContent />
}
