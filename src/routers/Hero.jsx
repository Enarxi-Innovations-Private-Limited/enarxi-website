import React from "react";
import {
  ArrowRight,
} from "lucide-react";

import ProductDevelopmentWorks from "./Components/ProductDevelopmentWorks";
import ServicesGrid from "./Components/OurWorkingDomain";
import OurStats from "./Components/OurStats";
import ServiceWeOffer from "./Components/ServiceWeOffer";
import WhyUs from "./Components/WhyUs";
import TrustedBy from "./Components/TrustedBy";
import CTA from "./Components/CTA";
import HeroComponent from "./Components/HeroComponent";


export default function Home() {

  return (
    <div className="flex flex-col items-center w-full">
        <HeroComponent />
        <ProductDevelopmentWorks />
        <ServicesGrid />
        <ServiceWeOffer />
        <OurStats />
        <WhyUs />  
        <TrustedBy /> 
        <CTA />    
    </div>
  );
}
