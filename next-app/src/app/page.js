import ProductDevelopmentWorks from "@/layout/ProductDevelopmentWorks";
import OurStats from "@/layout/OurStats";
import ServiceWeOffer from "@/layout/ServiceWeOffer";
import WhyUs from "@/layout/WhyUs";
import TrustedBy from "@/layout/TrustedBy";
import CTA from "@/layout/CTA";
import HeroComponent from "@/layout/HeroComponent";
import DomainsSection from "@/components/domain/DomainsSection";

export const metadata = {
  title: "Electronic Manufacturing & IT Services in Chennai",
  description: "Enarxi Innovations: Your premier partner for PCB design, OEM manufacturing, and custom IT services (Web, App, Software) in Chennai. Scale your business today.",
  keywords: "electronic manufacturing chennai, PCB design chennai, web development chennai, mobile app development chennai, software development company chennai, OEM manufacturing india",
  alternates: {
    canonical: "https://www.enarxi.com/",
  }
};

export default function Home() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Enarxi Innovations",
    "description": "Electronic Manufacturing and IT Digital Solutions in Chennai.",
    "url": "https://enarxi.com",
    "telephone": "+919600076639",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chennai",
      "addressRegion": "TN",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "12.9716",
      "longitude": "80.2452"
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
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
