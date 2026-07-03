import { Suspense } from "react"

import OnboardingSubscriptionContent from "@/app/onboarding/subscription/_components/onboarding-subscription-content"
import { Loader } from "@/components/ui/loader"

export default function OnboardingSubscriptionPage() {
  return (
    <Suspense
      fallback={<Loader variant="fetch" label="Loading..." className="py-24" />}
    >
      <OnboardingSubscriptionContent />
    </Suspense>
  )
}
