import AreYouPrepared from "@/app/_components/are-you-prepared"
import Hero from "@/app/_components/hero"
import HowItWorks from "@/app/_components/how-it-works"
import LandingPricingSection from "@/app/_components/landing-pricing-section"
import TestimonialsSlider from "@/app/_components/testimonials-slider"
import WhoItsFor from "@/app/_components/who-its-for"

export default function HomePage() {
  return (
    <>
      <Hero />
      <AreYouPrepared />
      <HowItWorks />
      <WhoItsFor />
      <LandingPricingSection />
      <TestimonialsSlider />
    </>
  )
}
