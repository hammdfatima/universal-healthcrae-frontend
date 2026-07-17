export type Testimonial = {
  id: string
  quote: string
  name: string
  role: string
  initials: string
  avatarColor: string
}

export const testimonials: Testimonial[] = [
  {
    id: "emily",
    quote:
      "My mother takes 14 medications and sees multiple doctors. If something happened while I wasn't there, I worried nobody would know her medical history. Now everything is in Universal Health Charts, and I know her information is available when it matters most.",
    name: "Emily Richardson",
    role: "Caregiver",
    initials: "ER",
    avatarColor: "bg-primary/15 text-primary",
  },
  {
    id: "james",
    quote:
      "When my wife had a medical emergency and couldn't speak for herself, the QR card gave first responders exactly what they needed. Having her allergies and medications in one place gave our family real peace of mind.",
    name: "James Thompson",
    role: "Spouse",
    initials: "JT",
    avatarColor: "bg-primary/15 text-primary",
  },
  {
    id: "maria",
    quote:
      "Our daughter left for college across the country. Knowing her health information is organized and accessible — for her and for us — made a stressful transition so much easier.",
    name: "Maria Lopez",
    role: "Parent",
    initials: "ML",
    avatarColor: "bg-primary/15 text-primary",
  },
  {
    id: "robert",
    quote:
      "As a veteran with multiple providers, my records were everywhere. Universal Health Charts finally put my medications, conditions, and documents in one secure place I can access anywhere.",
    name: "Robert Kim",
    role: "Member",
    initials: "RK",
    avatarColor: "bg-primary/15 text-primary",
  },
]
