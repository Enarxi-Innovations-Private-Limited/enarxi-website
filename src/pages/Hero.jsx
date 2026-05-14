import React from "react";

import ProductDevelopmentWorks from "../layout/ProductDevelopmentWorks";
import OurStats from "../layout/OurStats";
import ServiceWeOffer from "../layout/ServiceWeOffer";
import WhyUs from "../layout/WhyUs";
import TrustedBy from "../layout/TrustedBy";
import CTA from "../layout/CTA";
import HeroComponent from "../layout/HeroComponent";
import DomainsSection from "@components/domain/DomainsSection";


export default function Home() {

  return (
    <div className="flex flex-col items-center w-full">
        <HeroComponent />
        <ServiceWeOffer />
        <DomainsSection/>
        <ProductDevelopmentWorks />
        <OurStats />
        <WhyUs />  
        <TrustedBy /> 
        <CTA />    
    </div>
  );
}
