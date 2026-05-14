import React from "react";
import "../index.css";

// 🧩 import all logos (as in your code)
import tp1 from "../assets/trustedBy/tp1.svg";
import tp2 from "../assets/trustedBy/tp2.png";
import tp5 from "../assets/trustedBy/tp5.png";
import prystin from "../assets/trustedBy/pristynLogo.png";
import unova from "../assets/trustedBy/unova.png";
import aditya from "../assets/trustedBy/aditya.jpg";
import senmax from "../assets/trustedBy/senmax.png";
import greenbreathe from "../assets/trustedBy/greenbreathe.jpg";
import trayam from "../assets/trustedBy/trayam.png";
import shelfiLogoSvg from "../assets/trustedBy/shelfiLogo.svg";
import heejazLogoSvg from "../assets/trustedBy/heejazLogoSvg.png";
import ltiMindtree from "../assets/trustedBy/ltiMindtree.png";
import a3f from "../assets/trustedBy/a3f.avif";
import kardle from "../assets/trustedBy/kardle.png";
import airatom from "../assets/trustedBy/airatom.jpg";
import emobiliti from "../assets/trustedBy/emobiliti.webp";
import vatio from "../assets/trustedBy/vatio.png";
import propeller from "../assets/trustedBy/propeller.png";
import crescent from "../assets/trustedBy/crescent.png";
import ascentia from "../assets/trustedBy/ascentia.png";
import impensus from "../assets/trustedBy/impensus.png";
import senlogic from "../assets/trustedBy/senlogic.png";
import forge from "../assets/trustedBy/forge.png";
import aurolab from "../assets/trustedBy/aurolab.webp";
import srm from "../assets/trustedBy/srm.png";
import arkin from "../assets/trustedBy/arkin.png";
import zafi from "../assets/trustedBy/zafi.jpg";

const logos = [
  ascentia, impensus, senlogic, forge, aurolab, srm, arkin, zafi,
  vatio, propeller, crescent, airatom, emobiliti, kardle,
  tp1, tp2, tp5,
  unova, aditya, prystin, greenbreathe, trayam,
  shelfiLogoSvg, heejazLogoSvg, senmax, ltiMindtree, a3f
];

const TrustedBy = () => {
  // ✂️ Split logos into two sets
  const firstRow = logos.slice(0, Math.ceil(logos.length / 2));
  const secondRow = logos.slice(Math.ceil(logos.length / 2));

  return (
    <section className="mt-20 w-full flex flex-col justify-center items-center overflow-hidden">
      <h2 className="text-center mb-6 text-4xl text-oswald-bold pb-2 md:pb-4">Trusted By</h2>

      <div className="w-full flex flex-col gap-10">
        {/* Row 1 - scrolls left */}
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-scroll whitespace-nowrap gap-20">
            {firstRow.map((src, i) => (
              <img key={i} src={src} alt={`Logo ${i}`} className="h-12 object-contain inline-block" />
            ))}
            {/* duplicate once for seamless loop */}
            {firstRow.map((src, i) => (
              <img key={`dup1-${i}`} src={src} alt={`Logo dup ${i}`} className="h-12 object-contain inline-block" />
            ))}
          </div>
        </div>

        {/* Row 2 - scrolls right */}
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-scroll-rev whitespace-nowrap gap-20">
            {secondRow.map((src, i) => (
              <img key={`rev-${i}`} src={src} alt={`Logo reverse ${i}`} className="h-12 object-contain inline-block" />
            ))}
            {secondRow.map((src, i) => (
              <img key={`revdup-${i}`} src={src} alt={`Logo reverse duplicate ${i}`} className="h-12 object-contain inline-block" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
