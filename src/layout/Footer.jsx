import enarxiLogoWhite from "../assets/images/logo-white.svg";
// import whatsappFooterSVG from "../../assets/icons/whatsappFooterSVG.svg";
// import whatsapp from "../../assets/footer/whatsapp.png"
import { useLocation } from "react-router-dom";

import Whatsapp from "@assets/images/Whatsapp.png"
import { FaEnvelope, FaPhone, FaInstagram, FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const {pathname}  = useLocation();
  const marginTop = pathname === "/services" ? "mt-0" : "mt-12 md:mt-28"
  return (
    <>
      <footer className={`w-full bg-footer-background text-footer-foreground ${marginTop} `}>
        <div className="max-w-7xl text-poppins mx-auto px-6 sm:px-8 lg:px-12 py-10 md:py-12">
          {/* Grid Layout - 3 columns x 3 rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-8 md:gap-y-5 md:justify-items-center">
            
            {/* Row 1, Col 1: Logo - aligned with OFFICE title */}
            <div className="md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 flex items-start justify-center md:justify-start w-full">
              <img
                src={enarxiLogoWhite}
                alt="Enarxi Logo"
                className="h-12 md:h-14"
              />
            </div>

            {/* Row 2: Horizontal Dividers across all 3 columns */}
            <div className="hidden md:block md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-3 w-full self-start">
              <div className="border-t w-full border-gray-500"></div>
            </div>
            <div className="hidden md:block md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 w-full self-start">
              <div className="border-t w-full border-gray-500"></div>
            </div>
            <div className="hidden md:block md:col-start-3 md:col-end-4 md:row-start-2 md:row-end-3 w-full self-start">
              <div className="border-t w-full border-gray-500"></div>
            </div>

            {/* Row 3, Col 1: Office Section */}
            <div className="md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4 flex flex-col items-center md:items-start w-full self-start">
              <h3 className="text-footer-brand shrink text-md md:text-xl font-semibold mb-3 md:mb-4 tracking-wide">
                OFFICE
              </h3>
              <address className="not-italic shrink text-footer-foreground space-y-1 text-sm md:text-lg leading-relaxed text-center md:text-left">
                <p>Enarxi Innovations Pvt Ltd</p>
                <p>No. 23, Sripuram Colony, Vairalur,</p>
                <p>St. Thomas Mount,</p>
                <p>Chennai, Tamil Nadu – 600016</p>
              </address>
            </div>

            {/* Row 3, Col 2: Contact Section */}
            <div className="md:col-start-2 md:col-end-3 md:row-start-3 md:row-end-4 flex flex-col items-center md:items-start w-full self-start">
              <h3 className="text-footer-brand text-md md:text-xl font-semibold mb-3 md:mb-4 tracking-wide">
                CONTACT US
              </h3>
              <div className="space-y-2 flex flex-col items-center md:items-start text-sm md:text-lg">
                <a
                  href="tel:+919600676639"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-footer-foreground hover:text-footer-brand transition-colors hover:underline"
                  aria-label="Call us at +91 9600676639"
                >
                  +91-9600676639
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=info@enarxi.com&su=Product%20%26%20Service%20Enquiry&body=Hi%20Enarxi%20Team,%0A%0AI%20have%20a%20question%20about%20your%20hardware%20and%20software%20solutions.%0A%0APlease%20let%20me%20know%20how%20we%20can%20proceed.%0A%0ABest%20regards,%0A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-footer-foreground hover:text-footer-brand transition-colors hover:underline"
                  aria-label="Email us at info@enarxi.com"
                >
                  info@enarxi.com
                </a>
              </div>
            </div>

            {/* Row 3, Col 3: Follow Us Section */}
            <div className="md:col-start-3 md:col-end-4 md:row-start-3 md:row-end-4 flex flex-col items-center md:items-start w-full self-start">
              <h3 className="text-footer-brand text-md md:text-xl font-semibold mb-3 md:mb-4 tracking-wide">
                FOLLOW US ON
              </h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-[2vw]">
                <a
                  href="https://wa.me/+919600676639"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Contact us on WhatsApp"
                >
                  {/* <img src={whatsapp} alt="whatsapp Logo" className="w-5 h-5 md:w-6 md:h-6" /> */}
                  <FaWhatsapp alt="whatsapp Logo" className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=info@enarxi.com&su=Product%20%26%20Service%20Enquiry&body=Hi%20Enarxi%20Team,%0A%0AI%20have%20a%20question%20about%20your%20hardware%20and%20software%20solutions.%0A%0APlease%20let%20me%20know%20how%20we%20can%20proceed.%0A%0ABest%20regards,%0A"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Compose an email to info@enarxi.com in Gmail"
                >
                  <FaEnvelope className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="tel:+919600676639"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Call us"
                >
                  <FaPhone className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="https://www.instagram.com/enarxi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <FaInstagram className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="https://www.facebook.com/enarxitech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <FaFacebook className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/company/enarxi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Connect with us on LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section - Copyright and Links */}
          <div className="mt-8 md:mt-10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-footer-muted text-xs">
            <p className="text-center md:text-left mb-4 md:mb-0">
              © {new Date().getFullYear()} Enarxi Group. All Rights Reserved
            </p>
            <div className="flex items-center gap-4 md:gap-6">
              <a
                href="#"
                className="hover:text-footer-foreground transition-colors"
                aria-label="Read our Terms of Service"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-footer-foreground transition-colors"
                aria-label="Read our Privacy Policy"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
