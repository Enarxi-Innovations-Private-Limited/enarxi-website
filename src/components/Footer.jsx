import enarxiLogo from "../assets/image.png";
import { FaWhatsapp, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="w-[85%] mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700">
        {/* Logo + Office */}
        <div>
          <img src={enarxiLogo} alt="Enarxi Logo" className="h-10 mb-4" />
          <p className="text-gray-300 font-light text-sm mb-4">
            Enarxi Innovations Pvt Ltd, <br />
            18/2, 2nd floor, Valluvan St, <br />
            Purasaiwakkam, Chennai, Tamil Nadu 600007
          </p>
          <p className="text-gray-500 text-xs">© 2021 Enarxi Group. All Rights Reserved</p>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="uppercase text-sm font-semibold mb-4">Contact Us</h4>
          <p className="text-gray-300 text-sm">+91-9600676639</p>
          <a href="mailto:info@enarxi.com" className="text-gray-300 text-sm hover:underline">
            info@enarxi.com
          </a>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="uppercase text-sm font-semibold mb-4">Follow Us On</h4>
          <div className="flex space-x-4 text-xl text-gray-300">
            <a href="#" className="hover:text-green-500"><FaWhatsapp /></a>
            <a href="#" className="hover:text-red-500"><MdEmail /></a>
            <a href="#" className="hover:text-blue-400"><FiPhoneCall /></a>
            <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-600"><FaFacebook /></a>
            <a href="#" className="hover:text-blue-500"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="w-[85%] mx-auto py-4 flex flex-col md:flex-row justify-between text-xs text-gray-500">
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

