import type { Metadata } from "next"

import LegalPageLayout, {
  LegalCallout,
  LegalList,
  LegalParagraph,
  LegalSection,
} from "@/app/_components/legal-page-layout"
import { legalContact } from "@/app/_lib/legal-contact"

export const metadata: Metadata = {
  title: "Emergency Access Authorization | Universal Health Charts",
  description:
    "Understand how and when emergency access to your designated medical information may be provided.",
}

export default function EmergencyAccessAuthorizationPage() {
  return (
    <LegalPageLayout
      title="Emergency Access Authorization"
      description="Your authorization for emergency access to designated medical information."
      lastUpdated="June 19, 2026"
    >
      <LegalCallout>
        I authorize Universal Health Charts to provide emergency access to
        designated medical information when healthcare providers reasonably
        determine that I am unable to communicate or provide consent.
      </LegalCallout>

      <LegalSection title="Purpose of This Authorization">
        <LegalParagraph>
          This Emergency Access Authorization is a separate agreement that
          defines when and how designated medical information may be made
          available through Universal Health Charts emergency access features,
          including Emergency QR codes and related access workflows.
        </LegalParagraph>
        <LegalParagraph>
          This authorization is the foundation of our emergency access services
          and is required for enrollment.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="What You Authorize">
        <LegalParagraph>
          By accepting this authorization, you agree that:
        </LegalParagraph>
        <LegalList
          items={[
            "Universal Health Charts may provide access to the medical information you designate in your account settings when emergency access conditions are met",
            "Healthcare providers, caregivers, or other authorized individuals may view designated information according to your emergency access preferences",
            "Information made available may include medications, allergies, conditions, emergency contacts, and other records you choose to include",
            "You may update or revoke aspects of this authorization through your account settings, subject to applicable law and platform functionality",
          ]}
        />
      </LegalSection>

      <LegalSection title="When Access May Be Provided">
        <LegalParagraph>
          Emergency access may be provided when healthcare providers or other
          authorized parties reasonably determine that you are unable to
          communicate or provide consent, and access to your designated
          information is needed to support timely care or emergency response.
        </LegalParagraph>
        <LegalParagraph>
          The specific information disclosed depends on the emergency access
          settings you configure in your account.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Your Responsibilities">
        <LegalList
          items={[
            "Keep your emergency access settings current",
            "Protect QR cards, credentials, and account access",
            "Review designated information regularly for accuracy",
            "Notify us if you believe your credentials have been compromised",
          ]}
        />
      </LegalSection>

      <LegalSection title="Important Limitations">
        <LegalParagraph>
          Universal Health Charts does not provide medical advice, diagnosis, or
          treatment. Emergency access features are intended to help share
          member-provided information; they do not guarantee that information
          will be available in every situation or that care providers will
          access it.
        </LegalParagraph>
        <LegalParagraph>
          Universal Health Charts makes reasonable efforts to maintain platform
          availability but cannot guarantee uninterrupted access at all times.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Contact">
        <LegalParagraph>
          Questions about emergency access may be directed to:
        </LegalParagraph>
        <LegalList
          items={[
            `Company: ${legalContact.companyName}`,
            `Email: ${legalContact.email}`,
          ]}
        />
      </LegalSection>
    </LegalPageLayout>
  )
}
