import type { Metadata } from "next"

import LegalPageLayout, {
  LegalCallout,
  LegalList,
  LegalParagraph,
  LegalSection,
} from "@/app/_components/legal-page-layout"
import { legalContact } from "@/app/_lib/legal-contact"

export const metadata: Metadata = {
  title: "Terms of Use | Universal Health Charts",
  description:
    "Read the rules and responsibilities for using Universal Health Charts.",
}

export default function TermsOfUsePage() {
  return (
    <LegalPageLayout
      title="Terms of Use"
      description="What are the rules for using Universal Health Charts?"
      lastUpdated="June 19, 2026"
    >
      <LegalSection title="1. Acceptance of Terms">
        <LegalParagraph>
          By creating an account or using Universal Health Charts, you agree to
          these Terms of Use, our Privacy Policy, and the Emergency Access
          Authorization accepted during enrollment.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Service Description">
        <LegalParagraph>
          Universal Health Charts provides a secure platform that allows members
          to store and manage personal health information and make selected
          information available through emergency access features.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="3. Not Medical Advice">
        <LegalCallout>
          Universal Health Charts does not provide medical advice, diagnosis, or
          treatment.
        </LegalCallout>
        <LegalParagraph>
          Information stored in the platform is provided by members and is for
          informational and organizational purposes only. Always seek the advice
          of a qualified healthcare provider with questions regarding a medical
          condition.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="4. User Responsibilities">
        <LegalParagraph>Members are responsible for:</LegalParagraph>
        <LegalList
          items={[
            "Providing accurate information",
            "Maintaining passwords",
            "Updating records",
            "Protecting QR cards and access credentials",
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Emergency Access Authorization">
        <LegalParagraph>
          By enrolling in Universal Health Charts, members authorize emergency
          access to designated information in accordance with their account
          settings and emergency access preferences. The separate Emergency
          Access Authorization accepted at signup defines when and how this
          access may be provided.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. No Guarantee of Availability">
        <LegalParagraph>
          Universal Health Charts makes reasonable efforts to maintain
          availability but cannot guarantee uninterrupted access at all times.
          Service may be temporarily unavailable due to maintenance, technical
          issues, or circumstances beyond our reasonable control.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="7. Limitation of Liability">
        <LegalParagraph>
          To the fullest extent permitted by applicable law, Universal Health
          Charts shall not be liable for damages arising from inaccuracies in
          member-provided information, unauthorized credential sharing, or
          circumstances beyond its reasonable control.
        </LegalParagraph>
        <LegalParagraph>
          This section should be reviewed by qualified legal counsel for your
          jurisdiction and business requirements.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="8. Contact Information">
        <LegalList
          items={[
            `Company: ${legalContact.companyName}`,
            `Email: ${legalContact.email}`,
            `Mailing address: ${legalContact.mailingAddress}`,
          ]}
        />
      </LegalSection>
    </LegalPageLayout>
  )
}
