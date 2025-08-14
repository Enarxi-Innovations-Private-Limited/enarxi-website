// Footer.jsx
import enarxiLogoWhite from "@assets/images/logo/logo-white.svg";
import React from "react";
import { FaWhatsapp, FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { MdEmail, MdCall } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-8 md:px-20 py-10 w-full fixed bottom-0">
        <div className="px-20">
      {/* Logo aligned with Office section but container slightly center */}
      <div className="flex md:justify-start justify-center mb-6">
        <img src={enarxiLogoWhite} alt="Enarxi Logo" className="h-12 md:h-16" />
      </div>

      {/* Top Border Lines above each section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 mb-6 justify-center">
        <div className="border-t border-gray-600 w-full md:w-[200px] mx-auto"></div>
        <div className="border-t border-gray-600 w-full md:w-[200px] mx-auto"></div>
        <div className="border-t border-gray-600 w-full md:w-[200px] mx-auto"></div>
      </div>

      {/* Sections slightly center aligned */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 text-left md:text-left justify-items-center">
        {/* Office */}
        <div className="md:justify-self-start">
          <h3 className="font-bold mb-2 text-white">OFFICE</h3>
          <p>
            Enarxi Innovations Pvt Ltd,<br />
            18/2, 2nd floor, Valluvan St,<br />
            Purasaiwakkam, Chennai, Tamil Nadu 600007
          </p>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="font-bold mb-2">CONTACT US</h3>
          <p>+91-9600676639</p>
          <p className="underline cursor-pointer">info@enarxi.com</p>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="font-bold mb-2">FOLLOW US ON</h3>
          <div className="flex gap-4 mt-2 text-xl justify-center md:justify-start">
            <FaWhatsapp className="cursor-pointer" />
            <MdEmail className="cursor-pointer" />
            <MdCall className="cursor-pointer" />
            <FaInstagram className="cursor-pointer" />
            <FaFacebookF className="cursor-pointer" />
            <FaLinkedinIn className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Bottom Row (already correct) */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm mt-10 pt-6">
        <p className="mb-4 md:mb-0">© 2021 Enarxi Group. All Rights Reserved</p>
        <div className="flex gap-6">
          <p className="cursor-pointer">Terms of Service</p>
          <p className="cursor-pointer">Privacy Policy</p>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
