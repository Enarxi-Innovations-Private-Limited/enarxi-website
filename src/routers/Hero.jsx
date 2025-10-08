import React from "react";
import {
  ArrowRight,
} from "lucide-react";

import ProductDevelopmentWorks from "./Components/ProductDevelopmentWorks";
import ModernWorkingDomain from "./Components/ModernWorkingDomain";
import DomainsSection from "@components/newDomains/DomainSection";
import OurStats from "./Components/OurStats";
import ServiceWeOffer from "./Components/ServiceWeOffer";
import WhyUs from "./Components/WhyUs";
import TrustedBy from "./Components/TrustedBy";
import CTA from "./Components/CTA";
import HeroComponent from "./Components/HeroComponent";
import CustomHoneycomb from "@components/honey/HoneyComb";


export default function Home() {

  return (
    <div className="flex flex-col items-center w-full">
        <HeroComponent />
        <ProductDevelopmentWorks />
        <CustomHoneycomb />
        <DomainsSection />
        {/* <ModernWorkingDomain /> */}
        <ServiceWeOffer />
        <OurStats />
        <WhyUs />  
        <TrustedBy /> 
        <CTA />    
    </div>
  );
}
