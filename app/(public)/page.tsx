import EmergencyQrAccess from "@/app/_components/emergency-qr-access"
import Hero from "@/app/_components/hero"
import ProtectWhatMatters from "@/app/_components/protect-what-matters"
import WhyUniversal from "@/app/_components/why-universal"

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyUniversal />
      <EmergencyQrAccess />
      <ProtectWhatMatters />
    </>
  )
}
