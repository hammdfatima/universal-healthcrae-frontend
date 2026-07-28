import type { Metadata } from "next"

import LegalPageLayout, {
  LegalCallout,
  LegalList,
  LegalParagraph,
  LegalSection,
} from "@/app/_components/legal-page-layout"
import { legalContact } from "@/app/_lib/legal-contact"

export const metadata: Metadata = {
  title: "Notice of Privacy Practices | Universal Health Charts",
  description:
    "How Universal Health Charts protects, uses, and discloses your protected health information (PHI) under HIPAA.",
}

export default function NoticeOfPrivacyPracticesPage() {
  return (
    <LegalPageLayout
      title="Notice of Privacy Practices"
      description="How your health information is protected, used, and shared on Universal Health Charts."
      lastUpdated="July 27, 2026"
    >
      <LegalCallout>
        THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND
        DISCLOSED, AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW
        IT CAREFULLY.
      </LegalCallout>

      <LegalSection title="1. Our Commitment to Your Privacy">
        <LegalParagraph>
          Universal Health Charts is a patient-controlled personal health record
          platform. Unlike a hospital or clinic, we are not your healthcare
          provider — you are the owner and custodian of the health information
          you store with us. We are committed to protecting your protected
          health information (&ldquo;PHI&rdquo;) and to being transparent about
          how it is safeguarded, used, and disclosed consistent with the Health
          Insurance Portability and Accountability Act of 1996
          (&ldquo;HIPAA&rdquo;) and applicable state law.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Patient-Controlled Records">
        <LegalParagraph>
          Universal Health Charts is designed around the principle that you
          control your own medical record. You decide:
        </LegalParagraph>
        <LegalList
          items={[
            "What health information to enter, upload, or import into your account",
            "Which family members or care team members can view specific records",
            "What information is included in your Emergency Access profile and QR code",
            "When to export a full copy of your data or permanently delete your account",
          ]}
        />
        <LegalParagraph>
          We do not sell your health information, and we do not use it for
          marketing or advertising purposes.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="3. How We Protect Your Information">
        <LegalParagraph>
          We apply administrative, physical, and technical safeguards designed
          to meet HIPAA&apos;s Security Rule, including:
        </LegalParagraph>
        <LegalList
          items={[
            "Field-level encryption of sensitive health data at rest, in addition to encryption of the underlying database and backups",
            "Encryption in transit (TLS/HTTPS) for all traffic between your device and our servers",
            "Role-based access controls that limit who can view PHI, with every access recorded in an immutable audit log",
            "Step-up (re-authentication) requirements before high-risk actions such as exporting or deleting your full record",
            "Multi-factor authentication (MFA) for account sign-in and session controls including automatic sign-out after periods of inactivity",
            "Continuous monitoring for unauthorized access attempts and breach-notification procedures consistent with HIPAA's Breach Notification Rule",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. How Your Information May Be Used and Disclosed">
        <LegalParagraph>We may use or disclose your PHI to:</LegalParagraph>
        <LegalList
          items={[
            "Provide the core service — storing, organizing, and displaying your health records back to you and the people you authorize",
            "Enable emergency access you configure, so first responders or care providers can view designated information when you are unable to communicate or provide consent",
            "Share records with family members, caregivers, or care providers you explicitly invite or designate",
            "Operate, maintain, and improve the security and reliability of the platform",
            "Comply with a valid legal or regulatory obligation, such as a court order or law enforcement request",
          ]}
        />
        <LegalParagraph>
          We do not disclose your PHI to third parties for their own marketing
          purposes, and we will never sell your health information.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Emergency Access Disclosures">
        <LegalParagraph>
          If you enable Emergency Access, designated information (such as
          allergies, medications, conditions, and emergency contacts) may be
          made available to healthcare providers or other authorized individuals
          when they reasonably determine you are unable to communicate or
          provide consent. This disclosure is governed by the separate Emergency
          Access Authorization you accept during sign-up, and you may update
          your emergency access settings at any time.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Your Rights">
        <LegalParagraph>You have the right to:</LegalParagraph>
        <LegalList
          items={[
            "Access and review the health information in your account at any time",
            "Request an electronic export of your full record (a step-up password confirmation is required)",
            "Correct or update information you have entered",
            "Control who can view your records, including revoking sharing access",
            "View a log of active sign-in sessions and sign out of other devices",
            "Request permanent deletion of your account and associated records (a step-up password confirmation is required)",
          ]}
        />
      </LegalSection>

      <LegalSection title="7. Data Retention and Deletion">
        <LegalParagraph>
          We retain your information for as long as your account is active or as
          needed to provide the service. When you delete your account, we
          permanently remove your profile and health records from active
          systems, subject to any residual copies in encrypted backups that are
          purged on a routine rotation schedule and any retention required by
          law.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="8. Breach Notification">
        <LegalParagraph>
          If we discover a breach of unsecured PHI, we will notify affected
          individuals, and where required, regulators and the media, in
          accordance with the HIPAA Breach Notification Rule and applicable
          state law.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="9. Changes to This Notice">
        <LegalParagraph>
          We may update this Notice of Privacy Practices from time to time to
          reflect changes in our practices or applicable law. The &ldquo;Last
          updated&rdquo; date above reflects the most recent revision, and
          material changes will be communicated to you in-app or by email.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="10. Contact Us / Filing a Complaint">
        <LegalParagraph>
          If you have questions about this notice, believe your privacy rights
          have been violated, or want to exercise any of the rights described
          above, contact us:
        </LegalParagraph>
        <LegalList
          items={[
            `Company: ${legalContact.companyName}`,
            `Email: ${legalContact.email}`,
            `Mailing address: ${legalContact.mailingAddress}`,
          ]}
        />
        <LegalParagraph>
          You may also file a complaint with the U.S. Department of Health and
          Human Services, Office for Civil Rights. We will not retaliate against
          you for filing a complaint.
        </LegalParagraph>
      </LegalSection>
    </LegalPageLayout>
  )
}
