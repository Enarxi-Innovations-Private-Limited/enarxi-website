import React from "react";
import HowWeTravel from "@/assets/illustrations/how-we-travel.svg";

const HowWeTravelSection = () => {
  return (
    <section className="w-full h-screen my-8 max-md:h-[50vh] flex flex-col items-center justify-center bg-white mt-15">
      <h1 className="font-oswald">How Product Development Works?</h1>
      <img
        src={HowWeTravel}
        alt="Curved road showing how we travel now"
        className="w-full h-auto object-contain max-w-full max-h-full"
      />
    </section>
  );
};

export default HowWeTravelSection;
