import React from "react";

import ProductDevelopmentWorks from "./Components/ProductDevelopmentWorks";
import OurStats from "./Components/OurStats";
import ServiceWeOffer from "./Components/ServiceWeOffer";
import WhyUs from "./Components/WhyUs";
import TrustedBy from "./Components/TrustedBy";
import CTA from "./Components/CTA";
import HeroComponent from "./Components/HeroComponent";
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
