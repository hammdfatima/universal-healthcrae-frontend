import { User, Users } from "lucide-react"

export const pricingPlans = [
  {
    name: "Individual",
    price: "$9.95",
    description:
      "Protect yourself by keeping important health information ready when it matters most.",
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
      "Protect the partner you love with important health information ready for both of you.",
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
      "Protect the people—and pets—you love by keeping their important health information ready when it matters most.",
    members: "Up to 6 member profiles + pets",
    icon: Users,
    highlighted: false,
    badge: "Best Value",
    features: [
      "Everything in Couple",
      "Up to six family member profiles",
      "Pet profiles for the whole household",
      "One secure account for family & pets",
      "Perfect for children, parents, caregivers & pets",
      "Emergency access for every family member and pet",
      "Best per-member value",
    ],
  },
] as const

export type PricingPlan = (typeof pricingPlans)[number]
