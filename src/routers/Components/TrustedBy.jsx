import tp1 from "../../assets/trustedBy/tp1.svg";
import tp2 from "../../assets/trustedBy/tp2.svg";
import tp3 from "../../assets/trustedBy/tp3.svg";
import tp4 from "../../assets/trustedBy/tp4.svg";
import tp5 from "../../assets/trustedBy/tp5.svg";

import prystin from "../../assets/trustedBy/pristynLogo.png";
import unova from "../../assets/trustedBy/unova.png";
import aditya from "../../assets/trustedBy/aditya.jpg";
import senmax from "../../assets/trustedBy/senmax.png";
import greenbreathe from "../../assets/trustedBy/greenbreathe.jpg";
import trayam from "../../assets/trustedBy/trayam.png";
import shelfiLogoSvg from "../../assets/trustedBy/shelfiLogo.svg";
import heejazLogoSvg from "../../assets/trustedBy/heejazLogoSvg.png";
import ltiMindtree from "../../assets/trustedBy/ltiMindtree.png";
import a3f from "../../assets/trustedBy/a3f.avif";
import kardle from "../../assets/trustedBy/kardle.png";
import airatom from "../../assets/trustedBy/airatom.png";
import emobiliti from "../../assets/trustedBy/emobiliti.webp";
import vatio from "../../assets/trustedBy/vatio.png";
import propeller from "../../assets/trustedBy/propeller.png";
import crescent from "../../assets/trustedBy/crescent.png";
import ascentia from "../../assets/trustedBy/ascentia.png";
import impensus from "../../assets/trustedBy/impensus.png";
import senlogic from "../../assets/trustedBy/senlogic.png";
import forge from "../../assets/trustedBy/forge.png";
import aurolab from "../../assets/trustedBy/aurolab.webp";
import srm from "../../assets/trustedBy/srm.png";
import arkin from "../../assets/trustedBy/arkin.png";
import zafi from "../../assets/trustedBy/zafi.jpg";

import "../../index.css";

const TrustedBy = () => {
  const logos = [
    ascentia,
    impensus,
    senlogic,
    forge,
    aurolab,
    srm,
    arkin,
    zafi,
    vatio,
    propeller,
    crescent,
    airatom,
    emobiliti,
    kardle,
    tp1,
    tp2,
    tp3,
    tp4,
    tp5,
    unova,
    aditya,
    prystin,
    greenbreathe,
    trayam,
    shelfiLogoSvg,
    heejazLogoSvg,
    senmax,
    ltiMindtree,
    a3f,
  ];
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos]; // ensure long enough

  return (
    <section className="padding-y w-full flex flex-col justify-center items-center overflow-hidden">
      <h2 className="text-center mb-6 text-40 text-oswald-bold">Trusted By</h2>

      <div className="w-full overflow-hidden flex flex-col gap-10">
        {/* Left scrolling row */}
        <div className="scroll flex gap-20 items-center">
          {duplicatedLogos.map((src, i) => (
            <img
              key={`left-${i}`}
              src={src}
              alt={`Client ${i}`}
              className="h-12 object-contain"
            />
          ))}
        </div>

        {/* Right scrolling row (reverse direction) */}
        <div className="scroll-rev flex gap-20 items-center">
          {duplicatedLogos.map((src, i) => (
            <img
              key={`right-${i}`}
              src={src}
              alt={`Client ${i}`}
              className="h-12 object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
