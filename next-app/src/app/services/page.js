import ServicesClient from "./ServicesClient";

export const metadata = {
  title: "Our Services - Manufacturing & IT Solutions",
  description: "Explore Enarxi's comprehensive range of services including PCB design, OEM manufacturing, web development, mobile apps, and custom software development in Chennai.",
  keywords: "PCB fabrication, OEM manufacturing, embedded systems, firmware development, web development services, mobile app development, 3D printing Chennai, IT software solutions",
  alternates: {
    canonical: "https://www.enarxi.com/services"
  }
};

export default function ServicesPage() {
  return <ServicesClient />;
}
