import { User, Users } from "lucide-react"

export const pricingPlans = [
  {
    name: "Individual",
    price: "$9.95",
    description:
      "One member profile with your family's healthcare information in one secure place.",
    members: "1 member profile",
    icon: User,
    highlighted: false,
    features: [
      "Your secure medical information center",
      "Emergency Access QR Code",
      "Medications, allergies & conditions",
      "Emergency contact storage",
      "Lab reports & document uploads",
      "Access anywhere — home or on the go",
      "Encrypted data protection",
    ],
  },
  {
    name: "Couple",
    price: "$19.95",
    description:
      "Two member profiles — ideal for spouses or partners who want peace of mind together.",
    members: "2 member profiles",
    icon: Users,
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Everything in Individual",
      "Two fully separate member profiles",
      "Emergency QR access for both members",
      "Shared account, private health records",
      "Ideal for spouses or partners",
      "Caregiver-ready emergency visibility",
      "Encrypted data protection",
    ],
  },
  {
    name: "Family",
    price: "$29.95",
    description:
      "Up to six family member profiles — one account for the whole household.",
    members: "Up to 6 member profiles",
    icon: Users,
    highlighted: false,
    badge: "Best Value",
    features: [
      "Everything in Couple",
      "Up to six family member profiles",
      "One account for the whole household",
      "Perfect for children, parents & caregivers",
      "Manage loved ones' healthcare in one place",
      "Emergency access for every family member",
      "Best per-member value",
    ],
  },
] as const

export type PricingPlan = (typeof pricingPlans)[number]
