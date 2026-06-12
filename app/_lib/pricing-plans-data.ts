import { User, Users } from "lucide-react"

export const pricingPlans = [
  {
    name: "Individual Plan",
    price: "$9.95",
    description:
      "One member profile with secure medical record storage and emergency QR access.",
    members: "1 member profile",
    icon: User,
    highlighted: false,
    features: [
      "Secure cloud-based medical vault",
      "Emergency Access QR Code",
      "Medications, allergies & conditions",
      "Emergency contact storage",
      "Lab reports & document uploads",
      "Access anywhere — home or on the go",
      "Encrypted data protection",
    ],
  },
  {
    name: "Couple Plan",
    price: "$19.95",
    description:
      "Two member profiles with secure storage and emergency access.",
    members: "2 member profiles",
    icon: Users,
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Everything in Individual Plan",
      "Two fully separate member profiles",
      "Emergency QR access for both members",
      "Shared account, private health records",
      "Ideal for spouses or partners",
      "Caregiver-ready emergency visibility",
      "Encrypted data protection",
    ],
  },
  {
    name: "Family Plan",
    price: "$29.95",
    description: "Up to six family member profiles under one account.",
    members: "Up to 6 member profiles",
    icon: Users,
    highlighted: false,
    badge: "Best Value",
    features: [
      "Everything in Couple Plan",
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
