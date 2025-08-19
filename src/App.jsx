
import CtaInvite from "./components/ui/CtaInvite"
import Footer from "./components/ui/Footer"
import Header from "./components/ui/Header"
import Hero from "./components/ui/Hero"
import HowWeTravelSection from "./components/ui/HowWeTravelSection"
import ServicesSection from "./components/ui/ServicesSection"
import StatsStrip from "./components/ui/StatsStrip"
import { TrustedBy } from "./components/ui/TrustedBy"
import TrustedBySection from "./components/ui/TrustedBySection"
import WhyUs from "./components/ui/WhyUs"
import WorkingDomains from "./components/ui/WorkingDomains"
import { FeaturesSection } from "./components/WhyUs/FeaturesSection"


function App() {

  return (
    <>
        <Header/>
        <Hero/>
        <StatsStrip/>
        <WorkingDomains/>
        <ServicesSection/>
        <CtaInvite/>
        <HowWeTravelSection/>
        <WhyUs/>
        <FeaturesSection/>
        <TrustedBySection/>
        <Footer/>
    </>
  )
}

export default App
