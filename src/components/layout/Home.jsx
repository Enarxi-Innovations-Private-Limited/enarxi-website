import React from 'react'
import Header from '@components/ui/Header'
import StatsStrip from '@components/ui/StatsStrip'
import Hero from '@components/ui/Hero'
import WorkingDomains from '@components/ui/WorkingDomains'
import ServicesSection from '@components/ui/ServicesSection'
import CtaInvite from '@components/ui/CtaInvite'
import HowWeTravelSection from '@components/ui/HowWeTravelSection'
import WhyUs from '@/components/ui/WhyUs/WhyUs'
import FeaturesSection from '@components/ui/WhyUs/FeaturesSection'
import TrustedBySection from '@components/ui/TrustedBy/TrustedBySection'
import Footer from '@components/ui/Footer'

const Home = () => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export default Home