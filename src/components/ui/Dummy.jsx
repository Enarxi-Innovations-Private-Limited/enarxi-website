// Footer.jsx
import React from "react";
import { FaWhatsapp, FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { MdEmail, MdCall } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-20 py-10">
      <div className="flex justify-between">
        {/* Office Section */}
        <div>
          <h3 className="font-bold mb-2">OFFICE</h3>
          <p>
            Enarxi Innovations Pvt Ltd,<br />
            18/2, 2nd floor, Valluvan St,<br />
            Purasaiwakkam, Chennai, Tamil Nadu 600007
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="font-bold mb-2">CONTACT US</h3>
          <p>+91-9600676639</p>
          <p className="underline cursor-pointer">info@enarxi.com</p>
        </div>

        {/* Social Section */}
        <div>
          <h3 className="font-bold mb-2">FOLLOW US ON</h3>
          <div className="flex gap-4 mt-2 text-xl">
            <FaWhatsapp className="cursor-pointer" />
            <MdEmail className="cursor-pointer" />
            <MdCall className="cursor-pointer" />
            <FaInstagram className="cursor-pointer" />
            <FaFacebookF className="cursor-pointer" />
            <FaLinkedinIn className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="flex justify-between text-sm mt-10 border-t border-gray-700 pt-4">
        <p>© 2021 Enarxi Group. All Rights Reserved</p>
        <div className="flex gap-6">
          <p className="cursor-pointer">Terms of Service</p>
          <p className="cursor-pointer">Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
