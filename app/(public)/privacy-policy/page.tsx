import type { Metadata } from "next"

import LegalPageLayout, {
  LegalList,
  LegalParagraph,
  LegalSection,
} from "@/app/_components/legal-page-layout"
import { legalContact } from "@/app/_lib/legal-contact"

export const metadata: Metadata = {
  title: "Privacy Policy | Universal Health Charts",
  description:
    "Learn what information Universal Health Charts collects, how we use it, and how we protect your family's health data.",
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="What information we collect and what we do with it."
      lastUpdated="June 19, 2026"
    >
      <LegalSection title="1. Information We Collect">
        <LegalParagraph>
          Universal Health Charts collects information you provide when creating
          and using your account, including:
        </LegalParagraph>
        <LegalList
          items={[
            "Name",
            "Address",
            "Email address",
            "Phone number",
            "Emergency contacts",
            "Medical information entered by the member",
            "Uploaded documents",
            "Payment information (processed through third-party providers)",
          ]}
        />
      </LegalSection>

      <LegalSection title="2. How We Use Information">
        <LegalParagraph>We use information to:</LegalParagraph>
        <LegalList
          items={[
            "Provide account access",
            "Store member medical information",
            "Provide emergency access services",
            "Process payments",
            "Improve platform functionality",
            "Communicate with members",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Information Sharing">
        <LegalParagraph>
          Universal Health Charts does not sell personal information.
        </LegalParagraph>
        <LegalParagraph>Information may be shared:</LegalParagraph>
        <LegalList
          items={[
            "With authorized individuals designated by the member",
            "With healthcare providers when permitted by the member's emergency access settings",
            "When required by law",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Data Security">
        <LegalParagraph>
          We use reasonable administrative, technical, and physical safeguards
          designed to protect your information, including:
        </LegalParagraph>
        <LegalList
          items={[
            "Encryption",
            "Secure cloud storage",
            "Password protection",
            "Access controls",
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Member Rights">
        <LegalParagraph>Members may:</LegalParagraph>
        <LegalList
          items={[
            "Update information",
            "Download information",
            "Remove information",
            "Close their account",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Contact Information">
        <LegalParagraph>
          If you have questions about this Privacy Policy, please contact us:
        </LegalParagraph>
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
